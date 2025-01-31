import Link from "next/link";
import React from "react";

const navigation = [
    { name: "Chatbot", href: "/chatbot" },
];

export default function Accueil() {
    return (
      <div className="bg-gray-50 py-24 sm:py-32 gap-24 flex flex-col">
        <div className="flex flex-col items-start gap-12 px-12">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold text-gray-950">
              Trouvez votre prochain livre en un instant
            </h1>
            <p className="text-xl text-gray-700">
              Rejoignez la communauté des lecteurs pour trouver les livres de votre époque en toute sérénité et sur mesure.
            </p>
          </div>
          <a href="#" className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600">
            Testez Booksy
          </a>
        </div>
        
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight  text-gray-950 sm:text-5xl">
            Vos lectures sur-mesure en quelques mots
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Dîtes nous ce que vous aimez, on vous trouve votre prochain livre !
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Trouvez votre prochaine lecture en quelques secondes ! Grâce à notre chatbot intelligent, recevez des recommandations sur-mesure basées sur vos goûts et envies.
                  </p>
                </div>
                <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                  <div className="flex p-4">
                    <img
                      className="object-cover object-top"
                      src="https://www.pngplay.com/wp-content/uploads/15/Book-Stack-Transparent-Images.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Technologies Avancées</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Notre chatbot s’appuie sur des technologies telle que Langchain pour vous proposer des recommandations sur-mesure. Grâce au traitement du langage naturel (NLP), il comprend vos recherches et s’adapte à vos goûts.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                  <img
                    className="w-full max-lg:max-w-xs"
                    src="https://cdn.prod.website-files.com/653c206a64384dd5c586533c/65c9463252c798105c671d02_LangChain.jpeg"
                    alt=""
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Confidentialité & Sécurité</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Vos données restent privées et sont utilisées uniquement pour personnaliser votre expérience. Nous suivons des normes strictes pour garantir la sécurité de vos préférences et de votre historique de lecture.
                  </p>
                </div>
                <div className="@container flex flex-1  items-center max-lg:py-6 lg:pb-2">
                    <img
                    className="h-[min(152px,40cqw)] object-cover"
                    src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                    alt=""
                    />
                    {/* <a href="#" className="rounded-md bg-indigo-500 flex justify-center items-center px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex-grow">
                        Lancez vos recommandations
                    </a> */}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Une expérience fluide et intéractive
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    L’expérience utilisateur a été optimisée avec un design intuitif et un système de recommandations instantanées pour ne plus perdre votre temps.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      Futur mockup ou screen présentant le chatbot
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  