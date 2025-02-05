# IAbot

## Description
Assistant libraire basé sur l'IA pour recommander des livres, retrouver des informations sur les livres, etc.

## Prérequis
- Python 3.8 ou supérieur
- 16GB de RAM minimum
- Espace disque : minimum 10GB
- Connexion Internet stable (pour le téléchargement des modèles)

## Installation

### 1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]
```

### 2. Installation de Ollama

Merci de télécharger Ollama sur votre système d'exploitation :

```bash
https://ollama.com/download
```

### 3. Téléchargement des modèles

Vérifier que le serveur Ollama est bien installé.
```bash
ollama list
```
Dans le terminal, on devrai voir apparaître le modèle installé d'Ollama installé.

Vous pouvez maintenant télécharger les modèles nécessaires pour l'application.
```bash
ollama pull nomic-embed-text
ollama pull mistral:7B
```
⚠️ Note : Le téléchargement peut prendre plusieurs minutes selon votre connexion internet

Si une erreur apparaît, veuillez vérifier que le serveur Ollama est bien en cours d'exécution. (Dans un autre terminal, lancer `ollama serve`)

### 4. Créer et activer l'environnement virtuel :
```bash
python -m venv venv
pwd # Vous donne le chemin du dossier où se trouve le fichier venv et qu'il faut copier
source CHEMIN_DU_DOSSIER/venv/bin/activate  # Pour Linux/MacOS coller le chemin dans le terminal et terminer par `/venv/bin/activate`
# ou
venv\Scripts\activate  # Pour Windows
```

### 5. Installation des dépendances Python
```bash
pip install -r utils/requirements.txt
```

## Démarrage de l'application

Pour lancer le serveur de l'API :
```bash
uvicorn api.main:app --reload
```

L'API sera accessible à l'adresse : http://localhost:8000

## Test avec Postman

Pour tester l'API avec Postman :

1. Créer une nouvelle conversation :
Méthode : POST
URL : http://localhost:8000/conversations
Pas besoin de body
Vous recevrez un ID de conversation, gardez-le pour les tests suivants

2.Poser une question dans cette conversation :
Méthode : POST
URL : http://localhost:8000/ask
Headers : Content-Type: application/json
Body :
```json
{
   "conversation_id": "VOTRE_ID_DE_CONVERSATION",
   "question": "Quelle est la capitale de la France ?"
}
```

3. Voir toutes les conversations :
Méthode : GET
URL : http://localhost:8000/conversations
Vous devriez voir la conversation créée avec son historique

4. Voir une conversation spécifique :
Méthode : GET
URL : http://localhost:8000/conversations/VOTRE_ID_DE_CONVERSATION

5. Supprimer une conversation :
Méthode : DELETE
URL : http://localhost:8000/conversations/VOTRE_ID_DE_CONVERSATION

