# Connecter Supabase à LangChain
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from supabase import create_client
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import json
from datetime import datetime
from pathlib import Path

# Configuration Supabase
SUPABASE_URL = "https://tkmjiyxqmdmriylvrypl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWppeXhxbWRtcml5bHZyeXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMzEzOTcsImV4cCI6MjA1MzkwNzM5N30.ucYPDA_tOrk873nUXGHNYgi_BeqkTj9rRXrxq-g0wew"

def setup_qa_chain():
    """Configure la chaîne de question-réponse"""
    # Connexion à Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Configuration du vector store
    vector_store = SupabaseVectorStore(
        client=supabase,
        table_name="documents",
        embedding=OllamaEmbeddings(
            model="nomic-embed-text",
            base_url="http://localhost:11434"
        ),
        query_name="match_documents"
    )

    # Configuration du LLM
    llm = OllamaLLM(
        model="mistral:7B",
        base_url="http://localhost:11434",
        temperature=0.7,
        top_p=0.9
    )

    # Définir le prompt template
    prompt_template = """Tu es un assistant libraire virtuel qui doit UNIQUEMENT utiliser les métadonnées des documents fournis dans le contexte.

    RÈGLE D'OR ABSOLUE :
    - Tu dois TOUJOURS citer les métadonnées exactes des livres (titre, auteur, prix, etc.)
    - Quand tu parles d'un livre, tu DOIS mentionner son titre exact et son auteur
    - Tu ne dois JAMAIS inventer ou extrapoler des informations
    - Si une information n'est pas dans les métadonnées, réponds : "Cette information n'est pas disponible dans notre catalogue."
    
    UTILISATION DES MÉTADONNÉES :
    1. Pour chaque livre mentionné, tu DOIS utiliser :
       - Le titre exact tel qu'il apparaît dans les métadonnées
       - L'auteur exact tel qu'il apparaît dans les métadonnées
       - Le prix exact tel qu'il apparaît dans les métadonnées
       - Le résumé exact tel qu'il apparaît dans les métadonnées
       - La catégorie exacte telle qu'elle apparaît dans les métadonnées
    
    RÉPONSES OBLIGATOIRES :
    - Si l'information demandée n'est pas dans les métadonnées : "Cette information n'est pas disponible dans notre catalogue."
    - Si la question ne concerne pas les livres : "En tant qu'assistant libraire, je ne peux répondre qu'aux questions concernant les livres de notre catalogue."
    - Si le livre mentionné n'est pas dans les métadonnées : "Ce livre ne fait pas partie de notre catalogue actuel."
    
    FORMAT DE RÉPONSE :
    1. Commence toujours par citer les métadonnées pertinentes
    2. Structure ta réponse avec les informations exactes
    3. Ne fais JAMAIS de suppositions au-delà des métadonnées

    Historique de la conversation : {chat_history}
    Contexte actuel (avec métadonnées) : {context}
    Question actuelle : {question}

    Réponse : """

    # Configurer la mémoire avec plus de détails
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer",
        input_key="question"
    )

    # Utiliser ConversationalRetrievalChain avec des paramètres plus précis
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(),
        memory=memory,
        verbose=False,  # Désactiver les logs
        chain_type="stuff",
        combine_docs_chain_kwargs={
            "prompt": PromptTemplate(
                template=prompt_template,
                input_variables=["context", "question", "chat_history"]
            )
        }
    )

def load_chat_history():
    """Charge l'historique des conversations"""
    history_file = Path("chat_history.json")
    if history_file.exists():
        with open(history_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_chat_history(question, answer):
    """Sauvegarde une nouvelle interaction dans l'historique"""
    history_file = Path("chat_history.json")
    history = load_chat_history()
    
    history.append({
        "timestamp": datetime.now().isoformat(),
        "question": question,
        "answer": answer
    })
    
    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def is_english_response(text):
    """Vérifie si la réponse semble être en anglais"""
    english_indicators = ['the', 'is', 'are', 'this', 'that', 'here', 'book', 'hello', 'hi', 'I']
    first_words = text.lower().split()[:10]  # Vérifie les 10 premiers mots
    return any(word in first_words for word in english_indicators)

def chat():
    """Interface de chat interactive"""
    qa_chain = setup_qa_chain()
    print("🤖 Assistant libraire à votre service ! (tapez 'quit' pour quitter)")

    while True:
        question = input("❓ ").strip()

        if question.lower() in ['quit', 'exit', 'q']:
            print("👋 Au revoir !")
            break

        if not question:
            continue

        try:
            history = load_chat_history()
            response = qa_chain.invoke({
                "question": f"{question} [RÉPONDRE EN FRANÇAIS UNIQUEMENT]"
            })
            answer = response['answer']
            
            if "I " in answer or "the " in answer.lower():
                answer = "Je n'ai pas cette information dans ma base de données."
            
            save_chat_history(question, answer)
            print(f"📚 {answer}")
        except Exception as e:
            print(f"❌ {str(e)}")

if __name__ == "__main__":
    chat()