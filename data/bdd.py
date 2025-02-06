# /usr/bin/python3

# Connecter Supabase à LangChain
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_ollama import OllamaEmbeddings
from supabase import create_client
import pandas as pd

# Clés API Supabase
SUPABASE_URL = "https://tkmjiyxqmdmriylvrypl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWppeXhxbWRtcml5bHZyeXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMzEzOTcsImV4cCI6MjA1MzkwNzM5N30.ucYPDA_tOrk873nUXGHNYgi_BeqkTj9rRXrxq-g0wew"

# Langsmith
LANGSMITH_TRACING=True
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY="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"
LANGSMITH_PROJECT="Bootcamp IA"

# Connexion à Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Charger l'index des livres en tant que vecteurs
vector_store = SupabaseVectorStore(
    client=supabase,
    table_name="documents",
    embedding=OllamaEmbeddings(
        model="nomic-embed-text",
        base_url="http://localhost:11434"
    )
)

def insert_books_batch(csv_file):
    csv_path = f"data/{csv_file}"

    try:
        # Spécifier le séparateur comme point-virgule
        df = pd.read_csv(csv_path, sep=';', header=0)
        print(f"Lecture de {len(df)} lignes du CSV")

        # Traiter tous les documents en une seule fois
        all_texts = []
        all_metadatas = []

        for index, row in df.iterrows():
            try:
                # Vérification des champs obligatoires avec les nouvelles colonnes
                if pd.isna(row['Titre_clean']) or pd.isna(row['Auteur']) or pd.isna(row['Catégorie']):
                    print(f"Ligne {index} ignorée : données obligatoires manquantes")
                    continue

                # Construction du contenu pour l'embedding avec Titre_clean
                content = f"{row['Titre_clean']} {row['Auteur']} {row['Catégorie']}"

                # Construction des métadonnées avec les bonnes colonnes
                metadata = {
                    "title": str(row['Titre_clean']).strip(),
                    "author": str(row['Auteur']).strip(),
                    "category": str(row['Catégorie']).strip(),
                    "publisher": str(row['Éditeur']).strip() if pd.notna(row['Éditeur']) else "",
                    "description": str(row['Résumé']).strip() if pd.notna(row['Résumé']) else "",
                    "price": str(row['Prix']).strip() if pd.notna(row['Prix']) else "",
                    "link": str(row['Lien']).strip() if pd.notna(row['Lien']) else "",
                    "image_url": str(row['Image URL']).strip() if pd.notna(row['Image URL']) else ""
                }

                all_texts.append(content)
                all_metadatas.append(metadata)
                print(f"Préparation : {row['Titre_clean']}")

            except Exception as e:
                print(f"Erreur lors du traitement de la ligne {index}: {str(e)}")
                continue

        # Insérer tous les documents en une fois
        print(f"\nTentative d'insertion de {len(all_texts)} documents...")
        try:
            if len(all_texts) > 0:
                vector_store.add_texts(texts=all_texts, metadatas=all_metadatas)
                print("Insertion réussie !")
            else:
                print("Aucun document à insérer !")
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")

    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV : {e}")

# Exécution
insert_books_batch("livres.csv")

# Vérification finale
result = supabase.table('documents').select('*').execute()
print(f"\nVérification finale - Nombre de documents dans la base : {len(result.data)}")

