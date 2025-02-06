"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Renard from '/public/renard.png'

interface Conversation {
  id: string
  title: string
  preview: string
}

export function ChatSidebar() {
  // Exemple de conversations (à remplacer par vos données réelles)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Recommandations Fantasy",
      preview: "Discussion sur Le Seigneur des Anneaux...",
    },
    {
      id: "2",
      title: "Romans policiers",
      preview: "Suggestions de thrillers psychologiques...",
    },
    {
      id: "3",
      title: "Littérature classique",
      preview: "Les œuvres de Victor Hugo...",
    },
  ])

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id))
  }

  return (
    <div className="w-80 h-screen bg-white border-r border-stone-300 flex flex-col content-center items-center">
      <div className="flex flex-col items-start gap-5 self-stretch p-4">
        <div className="flex flex-row items-center gap-2 px-5 pb-4 border-b self-stretch border-stone-300">
            <Image alt="" src={Renard} className="size-14"/>
            <h2 className="text-lg font-semibold text-gray-900">
              Lexio
            </h2>
        </div>
        <button
          className="w-full flex items-center px-4 py-3 gap-2 rounded font-semibold text- text-white bg-orange-500 hover:bg-orange-600"
          onClick={() => console.log("Nouvelle conversation")}
        >
            <PlusIcon aria-hidden="true" className="size-6 stroke-white"/>
            Nouvelle conversation
        </button>
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-medium text-gray-900">{conversation.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{conversation.preview}</p>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conversation.id)
                  }}
                >
                  <TrashIcon aria-hidden="true" className=" stroke-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

