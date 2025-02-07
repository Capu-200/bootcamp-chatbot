"use client"

import { useState } from "react"
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Renard from '/public/renard.png'

import { useContext } from "react";
import { ChatContext } from "../context/chatContext";

interface Conversation {
  id: string
  title: string
  preview: string
}

export function ChatSidebar() {

  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;

  const { conversations, activeConversationId, addNewConversation, setActiveConversationId } = chatContext;

  // Exemple de conversations (à remplacer par vos données réelles)
  // const [conversations, setConversations] = useState<Conversation[]>([
  //   {
  //     id: "1",
  //     title: "Recommandations Fantasy",
  //     preview: "Discussion sur Le Seigneur des Anneaux...",
  //   },
  //   {
  //     id: "2",
  //     title: "Romans policiers",
  //     preview: "Suggestions de thrillers psychologiques...",
  //   },
  //   {
  //     id: "3",
  //     title: "Littérature classique",
  //     preview: "Les œuvres de Victor Hugo...",
  //   },
  // ])

  // const deleteConversation = (id: string) => {
  //   setConversations(conversations.filter((conv) => conv.id !== id))
  // }

  return (
    <div className="w-80 h-screen bg-stone-50 flex flex-col content-center items-center">
      <div className="flex flex-col items-start gap-5 self-stretch p-4">
        <div className="border-b self-stretch border-stone-300">
          <a className="flex flex-row items-center gap-2 px-5 pb-4 self-stretch" href="/">
            <Image alt="" src={Renard} className="size-14"/>
            <h2 className="text-lg font-semibold text-gray-900">
              Lexio
            </h2>
          </a>
        </div>
        <button
          className="w-full flex items-center px-4 py-3 gap-2 rounded font-semibold text- text-white bg-orange-500 hover:bg-orange-600"
          onClick={addNewConversation}
        >
            <PlusIcon aria-hidden="true" className="size-6 stroke-white"/>
            Nouvelle conversation
        </button>
        <div className="space-y-4">
          {/* {conversations.map((conv) => (
            <button
              key={conv.id}
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => setActiveConversationId(conv.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-medium text-gray-900">{conv.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{conv.name}</p>
                </div>
              </div>
            </button>
          ))} */}
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-center">Aucune conversation</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-2 rounded mb-2 transition ${
                  conv.id === activeConversationId ? "bg-gray-200 text-stone-900" : "bg-gray-50 hover:bg-gray-100 text-stone-900"
                }`}
              >
                {conv.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

