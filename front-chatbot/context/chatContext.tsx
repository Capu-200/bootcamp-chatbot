"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

type Message = {
    role: "user" | "ai";
    text: string;
};

type Conversation = {
    id: string;
    name: string;
    messages: Message[];
};

type ChatContextType = {
    conversations: Conversation[];
    activeConversationId: string | null;
    addNewConversation: () => void;
    setActiveConversationId: (id: string) => void;
    loadConversations: () => void;
    loadConversationById: (id: string) => void;
    sendMessage: (id: string, question: string) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // 🔹 Charger toutes les conversations
    const loadConversations = async () => {
        const res = await fetch("/api/chat");
        const data = await res.json();
        setConversations(data);
    };

  // 🔹 Charger une conversation spécifique
    const loadConversationById = async (id: string) => {
        const res = await fetch(`/api/chat/${id}`);
        const data = await res.json();
        setActiveConversationId(id);
        setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, messages: data.messages } : conv))
        );
    };

  // 🔹 Créer une nouvelle conversation
    const addNewConversation = async () => {
        const res = await fetch("/api/chat", { method: "POST" });
        const newConversation = await res.json();
        setConversations([newConversation, ...conversations]);
        setActiveConversationId(newConversation.id);
    };

  // 🔹 Envoyer un message
//   const sendMessage = async (id: string, question: string) => {
//     const res = await fetch(`/api/chat/${id}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question }),
//     });

//     const data = await res.json();
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === id ? { ...conv, messages: [...conv.messages, { role: "ai", text: data.response }] } : conv
//       )
//     );
//   };

    const sendMessage = async (id: string, question: string) => {
        try {
        const res = await fetch(`/api/chat/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });
    
        const data = await res.json();
    
        setConversations((prev) =>
            prev.map((conv) =>
            conv.id === id ? { ...conv, messages: [...conv.messages, { role: "ai", text: data.response }] } : conv
            )
        );
        } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        }
    };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <ChatContext.Provider
      value={{ conversations, activeConversationId, addNewConversation, setActiveConversationId, loadConversations, loadConversationById, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};