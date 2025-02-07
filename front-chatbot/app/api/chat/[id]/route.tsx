import { NextResponse } from "next/server";

const API_URL = "http://127.0.0.1:8000";

// 🔹 GET: Récupérer une conversation par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const res = await fetch(`${API_URL}/conversations/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Erreur lors de la récupération de la conversation");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Impossible de récupérer la conversation" }, { status: 500 });
  }
}

// 🔹 POST: Envoyer une question dans une conversation existante
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const { question } = await req.json(); // Récupère la question envoyée par le client
  
      // Vérifier que la question est bien présente
      if (!question) {
        return NextResponse.json({ error: "La question est requise." }, { status: 400 });
      }
  
      // Construire le JSON avec l'ID de conversation
      const requestBody = JSON.stringify({ conversation_id: id, question });
  
      // Envoyer la requête à l'API locale
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
  
      // Vérifier la réponse de l'API locale
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.statusText}`);
      }
  
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Impossible d'envoyer le message." }, { status: 500 });
    }
  }