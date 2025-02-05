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
  date: string
  preview: string
}

export function ChatSidebar() {
  // Exemple de conversations (à remplacer par vos données réelles)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Recommandations Fantasy",
      date: "2 min",
      preview: "Discussion sur Le Seigneur des Anneaux...",
    },
    {
      id: "2",
      title: "Romans policiers",
      date: "1h",
      preview: "Suggestions de thrillers psychologiques...",
    },
    {
      id: "3",
      title: "Littérature classique",
      date: "2j",
      preview: "Les œuvres de Victor Hugo...",
    },
  ])

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id))
  }

  return (
    <div className="w-80 h-screen bg-white border-r border-stone-300 flex flex-col content-center items-center">
      <div className="flex flex-col items-start gap-5 self-stretch p-4">
        <div className="flex flex-col items-start px-5">
            <Image alt="" src={Renard}/>
            <h2 className="text-base font-semibold text-gray-900">
              Lexio
            </h2>
        </div>
        <button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => console.log("Nouvelle conversation")}
        >
            <PlusIcon aria-hidden="true" className="size-6"/>
            Nouvelle conversation
        </button>
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-0.5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{conversation.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{conversation.preview}</p>
                    <span className="text-xs text-gray-400">{conversation.date}</span>
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conversation.id)
                  }}
                >
                  <TrashIcon aria-hidden="true" className="w-4 h-4 text-stone-400 hover:text-stone-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

