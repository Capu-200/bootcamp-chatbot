import asyncio
import pandas as pd
import logging
import re
from playwright.async_api import async_playwright

# -------------------------------------------------------------------------
#                            CONFIGURATION
# -------------------------------------------------------------------------
CSV_FILE = "livres_final_update3.csv"   # Chemin du CSV à mettre à jour
OUTPUT_FILE = "livres_final_update_final.csv"
AMAZON_SEARCH_URL = "https://www.amazon.fr/s?k="

# Nombre de tâches max à exécuter en parallèle
MAX_CONCURRENCY = 5

# Timeout pour page.goto (en millisecondes) : 30000 = 30 secondes
PAGE_GOTO_TIMEOUT = 30000

# Nombre maximal de tentatives (retries) si timeout
MAX_RETRIES = 2

# Configuration des logs
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Semaphore global pour limiter à MAX_CONCURRENCY tâches simultanées
SEM = asyncio.Semaphore(MAX_CONCURRENCY)

# -------------------------------------------------------------------------
#                            FONCTIONS UTILES
# -------------------------------------------------------------------------
async def goto_with_retry(page, url, wait_until="domcontentloaded", timeout=PAGE_GOTO_TIMEOUT, max_retries=MAX_RETRIES):
    """
    Tente d'accéder à `url` avec 'page.goto', en autorisant plusieurs tentatives.
    Si toutes échouent (timeout, réseau, etc.), on relance l'exception.
    """
    attempt = 1
    while True:
        try:
            await page.goto(url, wait_until=wait_until, timeout=timeout)
            return  # Succès : on sort
        except Exception as e:
            logging.warning(
                f"⚠️ [goto_with_retry] Échec tentative {attempt}/{max_retries} pour URL={url} : {e}"
            )
            if attempt >= max_retries:
                raise  # On remonte l'exception après plusieurs essais
            attempt += 1
            # Petite pause avant de retenter
            await asyncio.sleep(2)


async def fetch_description_from_mollat(page, book_url: str) -> str:
    """
    Scrape la description depuis Mollat si disponible :
      - section#quatrieme-couverture p
      - section#Resume p
    Retourne None si introuvable.
    """
    try:
        # On utilise le goto_with_retry pour éviter les timeouts ponctuels
        await goto_with_retry(page, book_url)
        description = await page.evaluate("""
            () => {
                let desc = document.querySelector("section#quatrieme-couverture p");
                if (!desc) desc = document.querySelector("section#Resume p");
                return desc ? desc.innerText.trim() : null;
            }
        """)
        return description if description else None

    except Exception as e:
        logging.warning(f"⚠️ [Mollat] Erreur lors de la récupération de la description : {e}")
        return None


async def fetch_ean13_from_mollat(page, book_url: str) -> str:
    """
    Récupère le numéro EAN13/ISBN13 sur Mollat :
      - Cherche dans <span class="badge-info"> précédé de <strong>EAN13 : ...> ou <strong>ISBN : ...>
      - Vérifie qu'il fait bien 13 chiffres.
    Retourne le EAN13 en string, ou None si non trouvé.
    """
    try:
        await goto_with_retry(page, book_url)
        ean = await page.evaluate("""
            () => {
                let paragraphs = document.querySelectorAll("div.col-sm-6 p");
                for (let p of paragraphs) {
                    let strongElem = p.querySelector("strong");
                    let spanElem = p.querySelector("span.badge-info");
                    if(!strongElem || !spanElem) continue;
                    let strongText = strongElem.innerText.trim().toUpperCase();
                    let spanText = spanElem.innerText.trim();
                    if ((strongText.includes("EAN13") || strongText.includes("ISBN"))
                        && spanText.match(/^\\d{13}$/)) {
                        return spanText;
                    }
                }
                return null;
            }
        """)
        return ean

    except Exception as e:
        logging.warning(f"⚠️ [Mollat/EAN13] Erreur (after retry) : {e}")
        return None


async def fetch_description_from_amazon_by_ean(context, ean13: str) -> str:
    """
    Recherche la description sur Amazon avec l'EAN13 :
      - On ouvre une nouvelle page
      - On va sur 'https://www.amazon.fr/s?k=<EAN13>'
      - On prend le premier résultat (a.a-link-normal.s-no-outline ou h2 a)
      - On va sur la page du livre et on récupère la description dans
        'div.a-expander-content.a-expander-partial-collapse-content span'
    Retourne None si introuvable.
    """
    page = await context.new_page()
    try:
        search_url = AMAZON_SEARCH_URL + ean13
        logging.info(f"🔎 [Amazon] Recherche par EAN13 : {ean13}")
        await goto_with_retry(page, search_url)

        results = await page.query_selector_all("div.s-main-slot div[data-component-type='s-search-result']")
        if not results:
            logging.warning(f"⚠️ [Amazon] Aucun résultat pour EAN13={ean13}")
            return None

        best_match = results[0]
        # Essai #1: lien .a-link-normal.s-no-outline
        book_link_element = await best_match.query_selector("a.a-link-normal.s-no-outline")
        if not book_link_element:
            # Essai #2: h2 a
            book_link_element = await best_match.query_selector("h2 a")
            if not book_link_element:
                logging.warning("[Amazon] Impossible de trouver le lien du livre dans le 1er résultat.")
                return None

        book_url = await book_link_element.get_attribute("href")
        if not book_url:
            logging.warning("[Amazon] Le lien trouvé n'a pas d'attribut href.")
            return None

        full_book_url = "https://www.amazon.fr" + book_url
        logging.info(f"🔎 [Amazon] Accès à la fiche: {full_book_url}")
        await goto_with_retry(page, full_book_url)

        # On récupère la description
        desc = await page.evaluate("""
            () => {
                let elem = document.querySelector("div.a-expander-content.a-expander-partial-collapse-content span");
                return elem ? elem.innerText.trim() : null;
            }
        """)
        return desc

    except Exception as e:
        logging.warning(f"⚠️ [Amazon] Erreur lors de la récupération de la description : {e}")
        return None
    finally:
        await page.close()

# -------------------------------------------------------------------------
#                            TRAITEMENT D'UN LIVRE
# -------------------------------------------------------------------------
async def process_book(row, context):
    """
    Fonction qui traite un livre :
     - Vérifie la description sur Mollat
     - Si None => récupère EAN13 sur Mollat => Amazon => description
    On retourne (status, desc):
      - status = 1 => trouvé Mollat
               2 => trouvé Amazon
               0 => rien trouvé
      - desc   = string de description ou None
    """
    async with SEM:  # On limite le nb de livres en parallèle
        title = row["Titre"]
        link = row["Lien"]
        current_desc = row["Description"]

        # Si la description n'est pas "vide" ou "Pas de description disponible", on skip
        if current_desc.strip().lower() not in ["", "pas de description disponible"]:
            return (0, current_desc)  # Déjà présente => pas de scraping

        logging.info(f"📖 [process_book] Traitement du livre: {title}")

        # 1) Tente la description Mollat
        page = await context.new_page()
        mollat_desc = await fetch_description_from_mollat(page, link)
        await page.close()

        if mollat_desc:
            logging.info(f"✅ [Mollat] Description trouvée pour {title}")
            return (1, mollat_desc)

        # 2) Sinon EAN13 + Amazon
        page = await context.new_page()
        ean = await fetch_ean13_from_mollat(page, link)
        await page.close()

        if not ean:
            logging.warning(f"❌ [process_book] Pas d'EAN13 pour {title}")
            return (0, None)

        amazon_desc = await fetch_description_from_amazon_by_ean(context, ean)
        if amazon_desc:
            logging.info(f"✅ [Amazon] Description trouvée via EAN13={ean} pour {title}")
            return (2, amazon_desc)
        else:
            logging.warning(f"❌ [Amazon] Aucune description pour {title} EAN={ean}")
            return (0, None)


# -------------------------------------------------------------------------
#                            BOUCLE PRINCIPALE
# -------------------------------------------------------------------------
async def update_descriptions_concurrent():
    """
    Parcourt le CSV, crée des tâches asynchrones pour chaque livre sans description,
    attend les résultats et met à jour le CSV final.
    """
    df = pd.read_csv(CSV_FILE)
    df["Description"] = df["Description"].fillna("")

    to_update = df[df["Description"].str.strip().str.lower().isin(["", "pas de description disponible"])]
    logging.info(f"🔍 {len(to_update)} livres avec une description manquante.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        # On crée une liste de tâches
        tasks = []
        indexes = to_update.index.tolist()

        for idx in indexes:
            row = to_update.loc[idx]
            # On lance process_book pour chaque ligne
            t = asyncio.create_task(process_book(row, context))
            tasks.append((idx, t))

        # On attend la fin de toutes les tâches
        results = await asyncio.gather(*[t[1] for t in tasks])

        # On met à jour le DF en fonction des résultats
        mollat_count = 0
        amazon_count = 0
        updated_count = 0

        for i, (idx, task) in enumerate(tasks):
            status, desc = results[i]
            if desc:  # On a une description
                df.at[idx, "Description"] = desc
                updated_count += 1
                if status == 1:
                    mollat_count += 1
                elif status == 2:
                    amazon_count += 1

        await browser.close()

    df.to_csv(OUTPUT_FILE, index=False)

    # Logs finaux
    logging.info(f"✅ {updated_count} descriptions mises à jour.")
    logging.info(f"📚 {mollat_count} descriptions récupérées depuis Mollat.")
    logging.info(f"🔥 {amazon_count} descriptions récupérées depuis Amazon.")


def main():
    asyncio.run(update_descriptions_concurrent())

if __name__ == "__main__":
    main()