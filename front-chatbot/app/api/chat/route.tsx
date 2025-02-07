import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/ask";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Log de la requête pour debug
    console.log("Requête envoyée à l'API:", {
      question: message,
      conversation_id: "default",
    });

    // Créer une nouvelle conversation si nécessaire
    try {
      const createConvRes = await fetch("http://127.0.0.1:8000/conversations", {
        method: "POST",
      });
      const convData = await createConvRes.json();
      const conversationId = convData.conversation.id;

      // Envoyer la question avec l'ID de conversation
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Réponse API non-OK:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        throw new Error(`Erreur API: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Réponse de l'API:", data);
      return NextResponse.json(data);
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur complète:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la communication avec l'API",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
