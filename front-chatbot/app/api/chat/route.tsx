import { NextResponse } from "next/server";

const API_URL = "http://127.0.0.1:8000";

// 🔹 GET: Récupérer toutes les conversations
// export async function GET() {
//   try {
//     const res = await fetch(`${API_URL}/conversations`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) throw new Error("Erreur lors de la récupération des conversations");

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Impossible de récupérer les conversations" }, { status: 500 });
//   }
// }
// 🔹 GET: Récupérer toutes les conversations et formater les données
export async function GET() {
    try {
      const res = await fetch(`${API_URL}/conversations`);
      const data = await res.json();
  
      // Vérification : L'API doit retourner un tableau
      if (!Array.isArray(data)) {
        throw new Error("Données invalides : l'API doit retourner un tableau");
      }
  
      // Formater les conversations avec un `name`
      const formattedConversations = data.map((conv) => ({
        id: conv.id,
        name: `Conversation du ${new Date(conv.created_at).toLocaleDateString("fr-FR")} à ${new Date(conv.created_at).toLocaleTimeString("fr-FR")}`,
        messages: conv.messages || [],
      }));
  
      return NextResponse.json(formattedConversations);
    } catch (error) {
      return NextResponse.json({ error: "Erreur lors de la récupération des conversations" }, { status: 500 });
    }
  }

// 🔹 POST: Créer une nouvelle conversation
export async function POST() {
  try {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Erreur lors de la création de la conversation");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Impossible de créer une conversation" }, { status: 500 });
  }
}