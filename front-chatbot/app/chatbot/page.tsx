"use client";
import React from "react";

import { useState } from "react";
import { ChatSidebar } from "../components/sidebar";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    // Ajouter le message de l'utilisateur à l'historique
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // Ajouter la réponse du bot à l'historique
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-white/95">
      <ChatSidebar />
      <div className="flex-1 flex flex-col bg-white/95">
        {/* Zone des messages avec meilleure visibilité */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-3xl shadow-sm ${
                msg.role === "user"
                  ? "bg-orange-100 ml-auto border border-orange-200"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`${
                  msg.role === "user" ? "text-gray-800" : "text-gray-900"
                } font-medium`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Zone de saisie avec fond plus opaque */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white shadow-lg"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez votre question ici..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 shadow-sm"
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
