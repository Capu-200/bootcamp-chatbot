import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/ask";

export async function POST(req: Request) {
  try {
    // Lire le message envoyé depuis le client
    const { conversation_id, question } = await req.json();

    // Vérifier que les champs sont présents
    if (!conversation_id || !question) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Envoyer la requête à l'API locale
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id, question }),
    });

    // Vérifier la réponse
    if (!res.ok) {
      throw new Error(`Erreur API locale: ${res.statusText}`);
    }

    // Retourner la réponse au client Next.js
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}