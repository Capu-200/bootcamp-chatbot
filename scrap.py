# /usr/bin/python3

import requests 
from bs4 import BeautifulSoup 
import time
import random
import json

# URL de la liste des meilleurs livres
URL = "https://www.goodreads.com/list/show/1.Best_Books_Ever?page={}"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

def get_books_from_page(page):
    """Scrape une page de livres et retourne une liste des informations extraites."""
    books = []
    response = requests.get(URL.format(page), headers=HEADERS)
    if response.status_code != 200:
        print(f"Erreur {response.status_code} sur la page {page}")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    book_elements = soup.select(".bookTitle")
    
    for book in book_elements:
        title = book.get_text(strip=True)
        link = "https://www.goodreads.com" + book["href"]
        books.append({"title": title, "link": link})
    
    return books

def scrape_goodreads(max_pages=5):
    """Scrape plusieurs pages de Goodreads et stocke les données."""
    all_books = []
    for page in range(1, max_pages + 1):
        print(f"Scraping page {page}...")
        books = get_books_from_page(page)
        all_books.extend(books)
        time.sleep(random.uniform(2, 5))  # Éviter d’être bloqué
    
    with open("goodreads_books.json", "w", encoding="utf-8") as f:
        json.dump(all_books, f, indent=4, ensure_ascii=False)
    
    print(f"Scraping terminé. {len(all_books)} livres récupérés.")

# Lancer le scraping (ex: récupérer les 5 premières pages)
scrape_goodreads(max_pages=5)
