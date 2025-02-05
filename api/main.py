from fastapi import FastAPI
from pydantic import BaseModel
from api.chain import setup_qa_chain, save_chat_history, load_chat_history
from api.ollama_manager import start_ollama
import uuid
import json
import datetime
from fastapi import FastAPI, HTTPException

# Démarrer Ollama avant tout
start_ollama()

# Initialiser FastAPI et le modèle
app = FastAPI()
qa_chain = setup_qa_chain()

# Définition du modèle de requête
class Query(BaseModel):
    question: str
    conversation_id: str

@app.post("/ask")
def ask_question(query: Query):
    try:
        # Charger toutes les conversations
        with open("conversations.json", "r", encoding="utf-8") as f:
            conversations = json.load(f)
            
        # Trouver la conversation spécifique
        conversation = next(
            (c for c in conversations if c["id"] == query.conversation_id),
            None
        )
        
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation non trouvée")

        # Obtenir la réponse du modèle
        response = qa_chain.invoke({
            "question": query.question,
            "chat_history": conversation.get("messages", [])
        })

        answer = response["answer"]

        # Ajouter le nouveau message à la conversation
        new_message = {
            "question": query.question,
            "answer": answer,
            "timestamp": datetime.datetime.now().isoformat()
        }

        conversation["messages"].append(new_message)

        # Sauvegarder les modifications
        with open("conversations.json", "w", encoding="utf-8") as f:
            json.dump(conversations, f, ensure_ascii=False, indent=2)

        return {
            "answer": answer,
            "source_documents": response.get("source_documents", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class Conversation(BaseModel):
    # Suppression des champs name et description
    pass

@app.post("/conversations")
def create_conversation():
    try:
        # Générer un ID unique pour la conversation
        conversation_id = str(uuid.uuid4())
        new_conversation = {
            "id": conversation_id,
            "created_at": datetime.datetime.now().isoformat(),
            "messages": []
        }

        # Sauvegarder la nouvelle conversation
        conversations = []
        try:
            with open("conversations.json", "r", encoding="utf-8") as f:
                conversations = json.load(f)
        except FileNotFoundError:
            pass

        conversations.append(new_conversation)
        with open("conversations.json", "w", encoding="utf-8") as f:
            json.dump(conversations, f, ensure_ascii=False, indent=2)

        return {
            "message": "Conversation créée avec succès",
            "conversation": new_conversation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):
    """Supprime une conversation spécifique"""
    try:
        # Charger toutes les conversations existantes
        with open("conversations.json", "r", encoding="utf-8") as f:
            conversations = json.load(f)

        # Filtrer pour retirer la conversation spécifiée
        updated_conversations = [c for c in conversations if c["id"] != conversation_id]

        # Si le nombre de conversations n'a pas changé, la conversation n'existait pas
        if len(updated_conversations) == len(conversations):
            raise HTTPException(status_code=404, detail="Conversation non trouvée")

        # Sauvegarder la liste mise à jour
        with open("conversations.json", "w", encoding="utf-8") as f:
            json.dump(updated_conversations, f, ensure_ascii=False, indent=2)

        return {"message": f"Conversation {conversation_id} supprimée avec succès"}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Fichier de conversations non trouvé")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations")
def list_conversations():
    """Liste toutes les conversations existantes"""
    try:
        # Charger toutes les conversations existantes
        with open("conversations.json", "r", encoding="utf-8") as f:
            conversations = json.load(f)
        return conversations
    except FileNotFoundError:
        # Si le fichier n'existe pas, retourner une liste vide
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str):
    """Récupère une conversation spécifique"""
    try:
        # Charger toutes les conversations existantes
        with open("conversations.json", "r", encoding="utf-8") as f:
            conversations = json.load(f)
        # Chercher la conversation avec l'ID spécifié
        conversation = next(
            (c for c in conversations if c["id"] == conversation_id), 
            None
        )

        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation non trouvée")

        return conversation
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Fichier de conversations non trouvé")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
