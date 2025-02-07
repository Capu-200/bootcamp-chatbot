import asyncio
import pandas as pd
import logging
from playwright.async_api import async_playwright

# 📌 Configuration
CSV_FILE = "livres_final_update_final.csv"  # 📂 Fichier source
OUTPUT_FILE = "livres_final_update_auteur.csv"  # 📂 Fichier de sortie
AMAZON_SEARCH_URL = "https://www.amazon.fr/s?k="  # 🔍 Recherche Amazon

# 🤏 Configuration des logs
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def count_remaining_books(df):
    """Compte le nombre de livres encore sans auteur."""
    return len(df[df["Auteur"] == "Auteur inconnu"])

async def fetch_author_from_mollat(page, book_url):
    """Scrape l'auteur depuis Mollat si disponible."""
    try:
        await page.goto(book_url, wait_until="domcontentloaded", timeout=15000)

        author = await page.evaluate("""
            () => {
                let headings = document.querySelectorAll("h2");
                for (let h2 of headings) {
                    if (h2.innerText.includes("Auteur")) {
                        let authorLink = h2.nextElementSibling?.querySelector("a.search-rebond");
                        return authorLink ? authorLink.innerText.trim() : null;
                    }
                }
                return null;
            }
        """)

        return author if author else None

    except Exception as e:
        logging.warning(f"⚠️ Erreur récupération auteur Mollat : {e}")
        return None

async def fetch_author_from_amazon(page, title):
    """Recherche et scrape l'auteur depuis Amazon."""
    try:
        search_url = AMAZON_SEARCH_URL + "+".join(title.split())
        await page.goto(search_url, wait_until="domcontentloaded", timeout=15000)
        
        # 🔍 Recherche du premier livre trouvé
        result = await page.query_selector("div.s-main-slot div[data-component-type='s-search-result']")
        if not result:
            return None
        
        book_link_element = await result.query_selector("h2 a")
        if not book_link_element:
            return None
        
        book_url = await book_link_element.get_attribute("href")
        full_book_url = "https://www.amazon.fr" + book_url
        await page.goto(full_book_url, wait_until="domcontentloaded", timeout=15000)
        
        author = await page.evaluate("""
            () => {
                let authorElement = document.querySelector("#bylineInfo span.author.notFaded a.a-link-normal");
                return authorElement ? authorElement.innerText.trim() : null;
            }
        """)
        
        return author if author else None
    except Exception as e:
        logging.warning(f"⚠️ Erreur récupération auteur Amazon : {e}")
        return None

async def update_authors():
    """Met à jour les auteurs des livres avec Mollat et Amazon."""
    df = pd.read_csv(CSV_FILE)
    df["Auteur"] = df["Auteur"].fillna("Auteur inconnu")

    missing_authors = df[df["Auteur"] == "Auteur inconnu"].copy()
    logging.info(f"🔍 {len(missing_authors)} livres sans auteur à rechercher.")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        updated_count = 0
        amazon_fallback_count = 0
        not_found_count = 0
        total_books = len(missing_authors)
        
        for index, row in missing_authors.iterrows():
            title, link = row["Titre"], row["Lien"]
            
            # 🔍 Recherche sur Mollat
            logging.info(f"🌍 Recherche auteur sur Mollat pour {title}")
            author = await fetch_author_from_mollat(page, link)

            if not author:
                logging.warning(f"⚠️ Aucune info auteur sur Mollat. Recherche Amazon...")
                author = await fetch_author_from_amazon(page, title)
                if author:
                    amazon_fallback_count += 1
                    logging.info(f"✅ Auteur récupéré via Amazon.")
                else:
                    not_found_count += 1
                    logging.error(f"❌ Aucun auteur trouvé pour {title}.")
            
            if author:
                df.at[index, "Auteur"] = author
                updated_count += 1
                remaining = count_remaining_books(df)
                logging.info(f"📌 Auteur mis à jour ({updated_count}/{total_books}), restants : {remaining}")
        
        await browser.close()
    
    # 📂 Sauvegarde du CSV mis à jour
    df.to_csv(OUTPUT_FILE, index=False)
    
    # 🏆 Logs finaux
    logging.info(f"✅ {updated_count} auteurs mis à jour.")
    logging.info(f"🔥 {amazon_fallback_count} auteurs récupérés depuis Amazon.")
    logging.info(f"❌ {not_found_count} auteurs toujours introuvables après Mollat et Amazon.")

if __name__ == "__main__":
    asyncio.run(update_authors())