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

// const categories = [
//     {name: "Polar"},
//     {name: "Romance"},
//     {name: "Fantaisie"},
//     {name: "Jeunesse"},
//     {name: "Horreur"},
//     {name: "Science-Fiction"},
//     {name: "Poésie"},
// ];

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

        {/* Header responsive */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Lexio</span>
                    <Image
                        alt="logo de l'entreprise représentant un renard qui lit"
                        src={Renard}
                        className="h-20 w-20"
                    />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                        {item.name}
                    </a>
                    ))}
                </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Lexio</span>
                    <Image
                        alt="logo de l'entreprise représentant un livre ouvert avec un rayon de lumière en sortant"
                        src={Renard}
                        className="h-10 w-10"
                    />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                    </div>
                    <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                            <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                            {item.name}
                            </a>
                        ))}
                        </div>
                    </div>
                    </div>
                </DialogPanel>
                </Dialog>
            </header>

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
                            
                            {/* <button className="flex flex-col justify-center items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                                <h3 className="font-semibold text-sm text-stone-900">Je envie de...</h3>
                                <p className="italic text-stone-500">”… un livre qui me fasse réfléchir sur le monde d’aujourd’hui.”</p>
                            </button>

                            <button className="flex flex-col justify-center items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                                <h3 className="font-semibold text-sm text-stone-900">Je cherche un livre...</h3>
                                <p className="italic text-stone-500">”… qui me fasse voyager dans un univers fantastique.”</p>
                            </button>

                            <button className="flex flex-col justify-start items-start gap-2 rounded-lg bg-stone-50 p-4 w-60 hover:bg-orange-50 focus:bg-orange-50 focus:border-2 focus:border-orange-500">
                                <h3 className="font-semibold text-sm text-stone-900 ">Voyage à travers les livres...</h3>
                                <p className="italic text-stone-500 content-start">”Un roman qui se passe au Japon ?”</p>
                            </button> */}
                        </div>
                        

                        <form className="flex flex-row gap-2 relative items-center self-stretch">
                            <input className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none  text-zinc-800 md:max-w-[500px] max-w-[calc(100dvw-32px)]" placeholder="Envoyer un message..." type="text" value={selectedText} />
                            <button className="w-auto rounded-md px-2 py-1.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-offset-2"> 
                                {/* <PaperAirplaneIcon aria-hidden="true" className="size-6" /> */}
                                <SparklesIcon aria-hidden="true" className="size-6"/>
                            </button>
                        </form>
                        {/* {
                            categories.map((category) => (
                                <button key={category.name} className={`text-gray-800 text-xs font-medium py-1 px-2 rounded-full border border-stone-400 focus:border-2 focus:text-orange-500 focus:font-semibold focus:border-orange-500 bg-white hover:bg-stone-100`}> {category.name} </button>
                            ))
                        } */}
                    </div>
                </div>
            </div>
        </div>
    )
}