import asyncio
import random
import csv
import os
import logging
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

# --------------------------------------------------------------------------
# 1) Configuration des catégories à scraper
#    "start-end" => ex: "200-280" signifie : on veut finir avec 280 livres au total dans le CSV
# --------------------------------------------------------------------------
CATEGORIES = [
    (
        "https://www.mollat.com/sciences-humaines-histoire",
        "sciences-humaines-histoire",
        "0-25000"
    ),
    (
        "https://www.mollat.com/arts-dossier",
        "arts-dossier",
        "0-10000"
    ),
    (
        "https://www.mollat.com/jeunesse",
        "jeunesse",
        "0-15000"
    ),
    (
        "https://www.mollat.com/bandes-dessinees",
        "bandes-dessinees",
        "0-5000"
    )
]

# --------------------------------------------------------------------------
# 2) Configuration globale
# --------------------------------------------------------------------------
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-G970F) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/537.36"
]

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


# --------------------------------------------------------------------------
# 3) Fonctions utilitaires
# --------------------------------------------------------------------------
async def random_delay(min_time=0.5, max_time=2):
    """Pause aléatoire pour simuler un comportement humain."""
    delay = random.uniform(min_time, max_time)
    await asyncio.sleep(delay)


async def scroll_to_bottom(page, steps=3):
    """
    Scrolle la page vers le bas en plusieurs étapes pour forcer le chargement
    d'éléments dynamiques. 'steps' = nombre de "coups" de scroll.
    """
    for _ in range(steps):
        # scrollBy(0, document.body.scrollHeight / steps) pour scroller progressivement
        await page.evaluate(
            """() => {
                window.scrollBy(0, window.innerHeight);
            }"""
        )
        await random_delay(0.5, 1.0)  # petite pause


async def get_element_text(page, selectors):
    """
    Retourne l'inner_text du 1er sélecteur trouvé parmi 'selectors'.
    """
    for sel in selectors:
        try:
            elt = await page.query_selector(sel)
            if elt:
                return (await elt.inner_text()).strip()
        except:
            continue
    return None


async def get_element_attribute(page, selector, attribute):
    """Retourne l'attribut d'un élément (ou None si pas trouvé)."""
    try:
        elt = await page.query_selector(selector)
        return await elt.get_attribute(attribute) if elt else None
    except:
        return None


async def close_cookie_banner(page):
    """
    Ferme la bannière cookies et retire l'overlay si présent.
    À relancer souvent (ex. avant de cliquer “Page suivante”).
    """
    try:
        # 1. Bouton "J'ACCEPTE"
        cookie_btn = await page.query_selector('button:has-text("J\'ACCEPTE")')
        if cookie_btn:
            await cookie_btn.click(timeout=3000)
            logging.info("🍪 Cookie banner cliqué !")
            await random_delay(0.5, 1.0)
    except:
        logging.info("⚠️ Aucun bouton cookie à fermer ou déjà cliqué.")

    # 2. Supprimer overlay qc-cmp2-container si présent
    try:
        await page.evaluate("""
            const qcContainer = document.getElementById('qc-cmp2-container');
            if (qcContainer) {
                qcContainer.remove();
            }
        """)
        logging.info("🧹 Overlay qc-cmp2-container supprimé (si existant).")
    except:
        logging.info("⚠️ Impossible de supprimer qc-cmp2-container (inexistant ou autre).")


# --------------------------------------------------------------------------
# 4) Lecture/écriture du CSV
# --------------------------------------------------------------------------
def read_existing_csv_info(csv_filename):
    """
    Lit le CSV (s'il existe) pour savoir :
    - nb total de livres déjà scrappés (books_already)
    - last_page : page où on s'était arrêté
    - last_pos : position dans la page
    Si pas de CSV => (0,1,0).
    """
    if not os.path.exists(csv_filename):
        return 0, 1, 0  # on part de rien

    with open(csv_filename, "r", encoding="utf-8") as f:
        reader = list(csv.reader(f))
        if len(reader) <= 1:
            # Seulement l'en-tête
            return 0, 1, 0

        # Dernière ligne
        last_line = reader[-1]
        # Format: [..., RangGlobal(8), Page(9), Position(10)] => indices : 0..10
        books_already = len(reader) - 1

        try:
            last_page = int(last_line[9])   # 10e colonne
            last_pos = int(last_line[10])   # 11e colonne
        except:
            last_page, last_pos = 1, 0

        return books_already, last_page, last_pos


def open_csv_for_append(csv_filename):
    """
    Ouvre le CSV en mode append si existe, sinon le crée et écrit l'entête.
    Retourne (file_handle, csv_writer).
    """
    file_exists = os.path.exists(csv_filename)
    f = open(csv_filename, "a" if file_exists else "w", newline="", encoding="utf-8")
    writer = csv.writer(f)

    if not file_exists:
        # On crée l'entête
        header = [
            "Titre",
            "Auteur",
            "Éditeur",
            "Description",
            "Prix",
            "Image URL",
            "Lien",
            "Catégorie",
            "RangGlobal",  # 9e
            "Page",        # 10e
            "Position"     # 11e
        ]
        writer.writerow(header)

    return f, writer


# --------------------------------------------------------------------------
# 5) Fonctions de scraping
# --------------------------------------------------------------------------
async def scrape_book_details(context, title, book_url):
    """
    Ouvre un nouvel onglet, scrape les infos principales d'un livre,
    gère un timeout plus grand + try/except => ignore le livre en cas de souci.
    """
    logging.info(f"📖 Scraping du livre : {title}")
    book_page = await context.new_page()

    # 1. Tenter le goto avec un délai plus large (60s)
    try:
        await book_page.goto(book_url, wait_until="domcontentloaded", timeout=60000)
    except PlaywrightTimeoutError as e:
        logging.warning(f"⏰ Timeout en ouvrant {book_url} => on skip ce livre. Erreur: {e}")
        await book_page.close()
        return None
    except Exception as e:
        logging.warning(f"⚠️ Erreur en ouvrant {book_url} => on skip. Erreur: {e}")
        await book_page.close()
        return None

    await random_delay(1, 2)

    # 2. Extraction des infos
    author = await get_element_text(book_page, ["h2:has-text('Auteur') a.search-rebond"])
    editor = await get_element_text(book_page, ["div.hidden-xs:has-text('Éditeur') a.search-rebond"])
    try:
        desc_elems = await book_page.query_selector_all("section#quatrieme-couverture p")
        description = " ".join([await e.inner_text() for e in desc_elems]) if desc_elems else None
    except:
        description = None

    price = await get_element_text(book_page, ["div.notice-price", "span.notice-price-big"])
    image_url = await get_element_attribute(book_page, "a.notice-cover img", "src")

    # 3. Vérif si prix ou image_url manquent => skip
    if not price or not image_url:
        logging.warning(f"⚠️ Infos essentielles manquantes pour {title}, livre ignoré.")
        await book_page.close()
        return None

    book_data = {
        "title": title,
        "author": author or "Auteur inconnu",
        "editor": editor or "Éditeur inconnu",
        "description": description or "Pas de description disponible",
        "price": price,
        "image_url": image_url,
        "link": book_url
    }
    logging.info(f"✅ Livre scrappé : {title}")
    await book_page.close()
    return book_data


async def scrape_category(category_url, category_name, range_str):
    """
    - range_str = "start-end"
      => on veut arriver à end livres au total dans le CSV.
    - On lit le CSV pour trouver le dernier page/pos atteint,
      on s'y repositionne, on skip, etc.
    - On SCROLL après chaque page load pour afficher la pagination.
    """
    # 1. Parse la plage
    try:
        start_int, end_int = map(int, range_str.split("-"))
    except:
        logging.error(f"❌ Mauvais format range_str pour '{category_name}': {range_str}")
        return 0

    csv_filename = f"/app/data/livres_{category_name}.csv"
    user_agent = random.choice(USER_AGENTS)

    # Lecture CSV existant
    books_already, last_page, last_pos = read_existing_csv_info(csv_filename)

    logging.info(f"🚀 User-Agent pour '{category_name}' : {user_agent}")
    logging.info(
        f"📂 CSV '{csv_filename}': {books_already} livres déjà présents. "
        f"Dernière page={last_page}, position={last_pos}"
    )

    # Si on a déjà >= end_int => rien à faire
    if books_already >= end_int:
        logging.info(
            f"✅ On a déjà {books_already} livres >= {end_int} visés pour '{category_name}'. "
            "Pas de scraping."
        )
        return 0

    to_collect = end_int - books_already
    logging.info(
        f"🎯 Objectif pour '{category_name}': {end_int} livres au total. "
        f"Il manque {to_collect} livres."
    )

    # 2. Lance Playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=user_agent)
        page = await context.new_page()

        logging.info(f"🌐 Ouverture catégorie : {category_url}")
        await page.goto(category_url, wait_until="domcontentloaded", timeout=60000)
        await close_cookie_banner(page)

        # SCROLL jusqu'en bas pour “révéler” la pagination
        await scroll_to_bottom(page)

        f, writer = open_csv_for_append(csv_filename)
        new_books_collected = 0
        current_page_num = 1

        # 2a. Avancer jusqu'à la page last_page (si > 1)
        while current_page_num < last_page:
            # On scrolle pour forcer l'affichage du bouton
            await scroll_to_bottom(page)
            next_btn = await page.query_selector('a.pagination-nav i.fa-angle-right')
            if not next_btn:
                logging.warning(
                    f"⚠️ Pas de 'page suivante' alors qu'on veut atteindre la page {last_page} "
                    f"(on est à page={current_page_num})."
                )
                break
            try:
                await close_cookie_banner(page)
                await next_btn.click(force=True, timeout=30000)
                await page.wait_for_load_state("domcontentloaded")
                await random_delay(1, 2)
                current_page_num += 1
                logging.info(f"⏭️ Avance rapide => page {current_page_num} / cible {last_page}")
                # On re-scroll pour la nouvelle page
                await scroll_to_bottom(page)
            except Exception as e:
                logging.warning(f"⚠️ Erreur en avançant à la page {current_page_num+1}: {e}")
                break

        # 3. On est supposé être sur la page = last_page
        while new_books_collected < to_collect:
            # scrolle chaque fois qu'on arrive sur la page
            await scroll_to_bottom(page)
            await random_delay(1, 2)

            items = await page.query_selector_all("#search-results-notices .row h3.notice-title a")            
            if not items:
                logging.warning(
                    f"⚠️ Aucun livre trouvé sur page={current_page_num} pour '{category_name}'. "
                    "Fin probable."
                )
                break

            # Si last_pos > nb items => on saute la page entière
            if last_pos > len(items):
                logging.info(
                    f"📖 Page {current_page_num} n'a que {len(items)} livres, "
                    f"mais last_pos={last_pos}. On passe direct à la page suivante."
                )
                last_pos -= len(items)
                # Page suivante
                await scroll_to_bottom(page)
                next_btn = await page.query_selector('a.pagination-nav i.fa-angle-right')
                if not next_btn:
                    logging.info("🚫 Pas de page suivante, fin.")
                    break
                try:
                    await close_cookie_banner(page)
                    await next_btn.click(force=True, timeout=30000)
                    await page.wait_for_load_state("domcontentloaded")
                    await random_delay(1, 2)
                    current_page_num += 1
                    logging.info(f"🔄 Next page => {current_page_num}")
                    # scroll again
                    await scroll_to_bottom(page)
                    continue
                except Exception as e:
                    logging.warning(f"⚠️ Erreur en changeant de page => {e}")
                    break

            # 3a. Skip last_pos items (déjà traités)
            skip_count = min(last_pos, len(items))
            logging.info(
                f"Page={current_page_num}: On saute les {skip_count} premiers livres "
                f"(pos=1..{skip_count}) déjà enregistrés."
            )
            start_index = skip_count
            # On a fini de skip => la prochaine fois, last_pos=0
            last_pos = 0

            # 3b. On scrape le reste de la page
            for i in range(start_index, len(items)):
                if new_books_collected >= to_collect:
                    break

                item = items[i]
                pos_in_page = i + 1  # 1-based index
                title = await item.inner_text()
                link = await item.get_attribute("href")
                full_link = link if link.startswith("http") else f"https://www.mollat.com{link}"

                book_data = await scrape_book_details(context, title, full_link)
                if book_data:
                    books_already += 1
                    new_books_collected += 1
                    row = [
                        book_data["title"],
                        book_data["author"],
                        book_data["editor"],
                        book_data["description"],
                        book_data["price"],
                        book_data["image_url"],
                        book_data["link"],
                        category_name,
                        books_already,      # RangGlobal
                        current_page_num,   # Page
                        pos_in_page         # Position
                    ]
                    writer.writerow(row)

            if new_books_collected >= to_collect:
                break

            # 4. Page suivante
            await scroll_to_bottom(page)
            next_btn = await page.query_selector('a.pagination-nav i.fa-angle-right')
            if not next_btn:
                logging.info(f"🚫 Pas de bouton 'Page suivante' pour '{category_name}' (page={current_page_num}). Fin.")
                break
            try:
                await close_cookie_banner(page)
                await next_btn.click(force=True, timeout=30000)
                await page.wait_for_load_state("domcontentloaded")
                await random_delay(1, 2)
                current_page_num += 1
                logging.info(f"🔄 Passage à la page suivante ({current_page_num}) de '{category_name}'")
                await scroll_to_bottom(page)
            except Exception as e:
                logging.warning(f"⚠️ Problème pour cliquer 'Page suivante' : {e}")
                break

        f.close()
        await browser.close()

    return new_books_collected


# --------------------------------------------------------------------------
# 6) Script principal
# --------------------------------------------------------------------------
async def main():
    for (url, cat_name, range_str) in CATEGORIES:
        logging.info(f"=== DÉBUT scraping catégorie '{cat_name}' (plage: {range_str}) ===")
        new_books = await scrape_category(url, cat_name, range_str)

        # Affichage en ROUGE à la fin
        logging.info(f"\033[91m=== FIN scraping catégorie '{cat_name}' : {new_books} nouveaux livres scrapés ===\033[0m\n")


if __name__ == "__main__":
    asyncio.run(main())