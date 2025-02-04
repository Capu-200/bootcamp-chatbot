import subprocess
import time
import requests

def start_ollama():
    """Démarre Ollama si ce n'est pas déjà fait."""
    try:
        response = requests.get("http://localhost:11434")
        if response.status_code == 200:
            print("✅ Ollama est déjà actif.")
            return
    except requests.ConnectionError:
        pass

    print("🚀 Démarrage d'Ollama...")
    subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Attendre qu'Ollama soit prêt
    time.sleep(3)
    print("✅ Ollama est prêt !")
