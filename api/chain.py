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
        model="llama2:13B",
        base_url="http://localhost:11434",
        temperature=0.7,
        top_p=0.9
    )

    # Définir le prompt template
    prompt_template = """Tu es un libraire français professionnel. Voici tes règles STRICTES :
    1. Réponds UNIQUEMENT en français correct et soigné
    2. PAS d'actions, d'émotions ou de gestes entre astérisques
    3. Reste factuel et concis
    4. Réponds DIRECTEMENT à la question sans te présenter
    5. Utilise UNIQUEMENT les informations du contexte fourni
    6. Si une information n'est pas dans le contexte, dis simplement "Je n'ai pas cette information"
    7. Pour les URLs ou prix, donne l'information exacte du contexte ou dis "Je n'ai pas cette information"
    8. Ne commence JAMAIS par "Bonjour", "Je suis", etc. Va droit au but
    9. Utilise l'historique de la conversation pour maintenir la cohérence
    10. Formulations à éviter absolument :
        - "je vous suggestais"
        - "j'espère que ces suggestions vous seront utiles"
        - "n'hésitez pas à me poser d'autres questions"
    11. Formulations correctes à utiliser :
        - "Voici les livres sur ce thème :"
        - "Parmi les livres disponibles :"
        - "Les ouvrages correspondants sont :"

    Historique de la conversation : {chat_history}
    Contexte actuel : {context}
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