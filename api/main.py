from fastapi import FastAPI
from pydantic import BaseModel
from api.chain import setup_qa_chain, save_chat_history, load_chat_history
from api.ollama_manager import start_ollama

# Démarrer Ollama avant tout
start_ollama()

# Initialiser FastAPI et le modèle
app = FastAPI()
qa_chain = setup_qa_chain()

# Définition du modèle de requête
class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_question(query: Query):
    """Pose une question au LLM."""
    try:
        response = qa_chain.invoke({
            "question": query.question,
            "chat_history": load_chat_history()
        })

        answer = response["answer"]

        # Sauvegarder l'historique
        save_chat_history(query.question, answer)

        return {
            "answer": answer,
            "source_documents": response.get("source_documents", [])  # Ajouter les sources si disponibles
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/reset_chat")
def reset_chat():
    with open("chat_history.json", "w", encoding="utf-8") as f:
        f.write("[]")  # Vide l'historique
    return {"message": "Chat réinitialisé"}

