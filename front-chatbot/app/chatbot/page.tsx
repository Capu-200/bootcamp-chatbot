"use client";

import { SparklesIcon } from '@heroicons/react/24/outline'

import { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../context/chatContext";

const promptExemple = [
    {name : "Surprenez-moi", value: '"Choisissez un livre totalement au hasard pour moi !"'},
    {name : "J'ai envie de...", value: '"… un livre qui me fasse réfléchir sur le monde d’aujourd’hui."'},
    {name : "Je cherche un livre...", value: '"… qui me fasse voyager dans un univers fantastique."'},
    {name : "Voyage à travers les livres...", value: '"Un roman qui se passe au Japon ?"'},
]

type Message = {
  role: "user" | "ai";
  text: string;
};

const Chat = () => {

    const chatContext = useContext(ChatContext);
    if (!chatContext) return null;

    // const [selectedText, setSelectedText] = useState("");
    
    // const handleSelect = (text: string) => {
    //     setSelectedText(text);
    // };

    const { conversations, activeConversationId, sendMessage } = chatContext;

    const [question, setQuestion] = useState(""); // Stocke la question de l'utilisateur
    const [messages, setMessages] = useState<Message[]>([]); // Stocke la réponse de l'IA
    const [currentAiMessage, setCurrentAiMessage] = useState(""); // Stocke la réponse progressive

    const [loading, setLoading] = useState(false); // Indique si la requête est en cours

    const [hasStarted, setHasStarted] = useState(false); // Indique si la conversation a commencé

    // const conversation_id ="7e676d07-8688-4ef7-b393-f182c2b452c4"; // ID de conversation statique pour l'exemple

    // Récupérer la conversation active
    const activeConversation = conversations.find((conv) => conv.id === activeConversationId) || {
        id: "",
        name: "",
        messages: [],
    };

    const handleSendMessage = async (event: React.FormEvent) => {
        event.preventDefault(); // Empêche le rechargement de la page
        if (!question) return;

        setHasStarted(true); // Cache l'introduction après le premier message
        setMessages((prev) => [...prev, { role: "user", text: question }]); // Ajoute le message utilisateur

        setLoading(true); // Active l'indicateur de chargement

        setQuestion(""); // Vide l'input après l'envoi
        setCurrentAiMessage(""); // Réinitialise la réponse en cours

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activeConversationId, question }),
        });

        const data = await res.json();
        // setMessages((prev) => [...prev, { role: "ai", text: data.answer || "Aucune réponse reçue." }]); // Ajoute la réponse de l'IA
        displayAiResponse(data.answer || "Aucune réponse reçue.");

    } catch (error) {
        console.error("Erreur API :", error);
        displayAiResponse("Erreur de connexion à l'API.");

    } finally {
        setLoading(false);
    }
  };

  // Fonction pour afficher la réponse progressivement
  const displayAiResponse = (fullText: string) => {
    let i = 0;
    setCurrentAiMessage(""); // Réinitialise avant de commencer

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setCurrentAiMessage((prev) => prev + fullText[i]); // Ajoute une lettre
        i++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: "ai", text: fullText }]); // Ajoute la réponse finale au chat
        setCurrentAiMessage(""); // Réinitialise le message temporaire
      }
    }, 30); // Vitesse d'affichage (30ms par lettre)
  };

  return (
    <div className="bg-white h-full">
        <div className="relative isolate pt-14 lg:px-8 flex flex-row justify-center pb-20 h-full bg-white">
            <div className="flex flex-col justify-between gap-4">
                {!hasStarted && ( // Cache l'intro après le premier message
                    <div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
                        <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-800 text-sm border-zinc-200">
                            <p className="font-semibold"> Bienvenue sur Lexio, l'IA qui comprend tes goûts littéraires.</p>
                            <div className="gap-3">
                                <p className="text-zinc-800"> Dis nous ce que tu aimes : </p>
                                <p className="italic text-zinc-500"> "J'ai adoré le Seigneur des Anneaux, que me recommandez-vous ?" </p> 
                            </div>
                            <div className="gap-3">
                                <p className="text-zinc-800"> Affine ta sélection en fonction de ton envie : </p>
                                <p className="italic text-zinc-500"> "J’aimerais une lecture légère et feel-good." </p> 
                                <p className="italic text-zinc-500"> "Je veux un thriller psychologique court mais intense." </p> 
                            </div>                   
                        </div>
                    </div>
                    
                )}

                {/* {promptExemple.map((prompt) => (
                    <button
                        key={prompt.name}
                        onClick={() => handleSelect(prompt.value)}
                        className="flex flex-col justify-center items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                            <h3 className="font-semibold text-sm text-stone-900">{prompt.name}</h3>
                            <p className="italic text-stone-500">{prompt.value}</p>
                    </button>
                    ))
                } */}
                

                {/* Espace de chat */}
                <div className="max-w-[500px] space-y-4 gap-5 overflow-y-auto">
                    {/* {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`p-2 rounded-lg max-w-xs ${
                        msg.role === "user" ? "bg-orange-100 text-white self-end ml-auto" : "bg-gray-100 text-black"
                        }`}
                    >
                        {msg.text}
                    </div>
                    ))} */}
                    {/* Affichage progressif de la réponse IA */}
                    {/* {currentAiMessage && (
                    <div className="p-2 rounded-lg max-w-xs bg-gray-200 text-black">
                        {currentAiMessage}
                    </div>
                    )} */}

                    {activeConversation.messages.map((msg, index) => (
                        <div
                        key={index}
                        className={`p-2 rounded-lg max-w-xs ${
                            msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
                        }`}
                        >
                        {msg.text}
                        </div>
                    ))}
                    {currentAiMessage && <div className="p-2 rounded-lg max-w-xs bg-gray-200 text-black">{currentAiMessage}</div>}
                </div>

                {/* Formulaire de saisie */}
                <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Pose une question..."
                        className="border p-2 rounded w-full focus:stroke-orange-500 text-zinc-800"
                    />
                    <button 
                        type="submit" 
                        className="p-2 bg-orange-500 text-white rounded"
                        disabled={loading}
                    >
                    {loading ? "..." : <SparklesIcon aria-hidden="true" className="size-6"/>}
                    </button>
                </form>
            </div>
            

        </div>
    </div>
  );
};

export default Chat;