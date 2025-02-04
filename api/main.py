from fastapi import FastAPI
from pydantic import BaseModel
from api.chain import setup_qa_chain, save_chat_history
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
            "question": f"{query.question} [RÉPONDRE EN FRANÇAIS UNIQUEMENT]"
        })
        answer = response["answer"]
        
        # Vérifier si la réponse est en anglais
        if "I " in answer or "the " in answer.lower():
            answer = "Je n'ai pas cette information dans ma base de données."
        
        # Sauvegarder l'historique
        save_chat_history(query.question, answer)
        
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}

# Pour lancer l'API : uvicorn api.main:app --reload
