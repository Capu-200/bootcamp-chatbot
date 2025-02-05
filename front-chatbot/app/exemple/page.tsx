'use client'
import Link from "next/link";
import React from "react";

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Renard from '/public/renard.png'

const navigation = [
    { name: "Produit", href: "/" },
    { name: "Chatbot", href: "/chatbot" },
];

const promptExemple = [
    {name : "Surprenez-moi", value: '"Choisissez un livre totalement au hasard pour moi !"'},
    {name : "J'ai envie de...", value: '"… un livre qui me fasse réfléchir sur le monde d’aujourd’hui."'},
    {name : "Je cherche un livre...", value: '"… qui me fasse voyager dans un univers fantastique."'},
    {name : "Voyage à travers les livres...", value: '"Un roman qui se passe au Japon ?"'},
]

export default function Chatbot() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const [selectedText, setSelectedText] = useState("");

    const handleSelect = (text: string) => {
        setSelectedText(text);
    };

    return (
        <div className="bg-white h-full"> 

            <div className="relative isolate pt-14 lg:px-8 flex flex-row justify-center pb-20 h-dvh bg-white">
                <div className="flex flex-col justify-between gap-4">
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
                    <div className="flex flex-col items-start gap-4 w-[500px] justify-center ">
                        <div className="flex items-center content-center flex-wrap grids-col-1 gap-4">
                            {promptExemple.map((prompt) => (
                                <button
                                    key={prompt.name}
                                    onClick={() => handleSelect(prompt.value)}
                                    className="flex flex-col justify-center items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                                        <h3 className="font-semibold text-sm text-stone-900">{prompt.name}</h3>
                                        <p className="italic text-stone-500">{prompt.value}</p>
                                </button>
                                ))
                            }

                            {/* <button className="flex flex-col justify-center items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                                <h3 className="font-semibold text-sm text-stone-900">Surprenez-moi</h3>
                                <p className="italic text-stone-500">“Choisissez un livre totalement au hasard pour moi !”</p>
                            </button> */}
                            
                        </div>
                        

                        <form className="flex flex-row gap-2 relative items-center self-stretch">
                            <input className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none  text-zinc-800 md:max-w-[500px] max-w-[calc(100dvw-32px)]" placeholder="Envoyer un message..." type="text" value={selectedText} />
                            <button className="w-auto rounded-md px-2 py-1.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-offset-2"> 
                                {/* <PaperAirplaneIcon aria-hidden="true" className="size-6" /> */}
                                <SparklesIcon aria-hidden="true" className="size-6"/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}