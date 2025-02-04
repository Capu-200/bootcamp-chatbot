# Nom de votre projet

## Description
Assistant libraire basé sur l'IA pour recommander des livres, retrouver des informations sur les livres, etc.

## Prérequis
- Python 3.8 ou supérieur
- 16GB de RAM minimum
- Espace disque : minimum 10GB
- Connexion Internet stable (pour le téléchargement des modèles)

## Installation

### 1. Installation d'Ollama

#### Pour macOS et Linux :

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Pour Windows :
- Télécharger depuis [ollama.com/download/windows](https://ollama.com/download/windows)
- Installer le fichier .exe téléchargé

### 2. Téléchargement des modèles

Démarrer le serveur Ollama
```bash
ollama serve
```
Dans un nouveau terminal, télécharger les modèles
```bash
ollama pull nomic-embed-text
ollama pull llama2:13b
```
⚠️ Note : Le téléchargement peut prendre plusieurs minutes selon votre connexion internet

### 3. Installation des dépendances Python

```bash
pip install -r requirements.txt
```

### 4. Configuration de l'environnement

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]
```

2. Créer et activer l'environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Pour Linux/MacOS
# ou
venv\Scripts\activate  # Pour Windows
```

## Démarrage de l'application

1. S'assurer qu'Ollama est en cours d'exécution :
```bash
ollama serve
```

2. Dans un nouveau terminal, lancer l'application :
```bash
uvicorn api.main:app --reload
```

L'API sera accessible à l'adresse : http://localhost:8000

## Test avec Postman

Pour tester l'API avec Postman :

1. Créez une nouvelle requête POST vers `http://localhost:8000/ask`
2. Dans Headers, ajoutez :
   - Key: `Content-Type`
   - Value: `application/json`
3. Dans Body, sélectionnez "raw" et "JSON", puis ajoutez :
```json
{
    "question": "Votre question ici"
}
```
4. Cliquez sur "Send" pour obtenir la réponse.

## Structure du projet
```
project/
├── api/
│   ├── main.py
│   ├── chain.py
│   └── ollama_manager.py
├── utils/
│   └── requirements.txt
├── README.md
└── .env
```

