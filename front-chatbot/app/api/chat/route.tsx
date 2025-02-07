import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/";

// 🔹 GET: Récupérer toutes les conversations
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Erreur lors de la récupération des conversations");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Impossible de récupérer les conversations" }, { status: 500 });
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