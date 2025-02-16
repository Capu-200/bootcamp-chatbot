'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from '/public/logo.svg'
import Books from '/public/books.png'
import Bulb from '/public/metal_bulb.png'
import Renard from '/public/renard.png'
import Security from '/public/metal_security.png'
import Frame from '/public/metal_frame.png'

const navigation = [
  { name: 'Produit', href: '#produit-section' },
  { name: 'Chatbot', href: '/chatbot' },
]

export default function Projet() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Lexio</span>
              <Image
                alt="logo de l'entreprise représentant un livre ouvert avec un rayon de lumière en sortant"
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
              <span className="sr-only">Booksy</span>
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

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 top-40 z-10 transform-gpu overflow-hidden blur-3xl sm:top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-orange-300 to-amber-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Ne manquez jamais un bon livre.{' '}
              <a href="#" className="font-semibold text-orange-500">
                <span aria-hidden="true" className="absolute inset-0" />
                Inscrivez-vous ! <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                Lexio,
                 l’IA qui comprend vos goûts !
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Besoin d’inspiration ? Notre chatbot vous guide vers des lectures qui vous ressemblent. N'attendez plus, lancez votre recommandation en un clic !
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/chatbot"
                className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Lancez votre recommandation
              </a>
              <a href="#produit-section" className="text-sm/6 font-semibold text-gray-900">
                En apprendre plus <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      <div id="produit-section" className="bg-gray-50 py-24 sm:py-32 gap-24 flex flex-col">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Vos lectures sur-mesure en quelques mots
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-semibold tracking-tight text-gray-950 max-lg:text-center">
                    Dîtes nous ce que vous aimez, on vous trouve votre prochain livre !
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Un bon livre, c’est bien plus qu’une simple histoire : c’est une porte ouverte vers l’imaginaire, la connaissance et l’émotion. Mais comment trouver celui qui vous fera vibrer ? 
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Notre chatbot vous accompagne dans cette quête en vous proposant des lectures adaptées à vos envies et à votre humeur. Que vous soyez en quête de frissons, de poésie ou d’évasion, il trouve pour vous le livre idéal. Faites-lui confiance et laissez la magie opérer !
                  </p>
                </div>
                <div className="relative max-lg:mx-auto max-lg:max-w-sm">
                  <div className="flex px-4">
                    <Image
                      className="object-cover object-top"
                      src={Bulb}
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
                  <p className="mt-2 text-lg font-semibold tracking-tight text-gray-950 max-lg:text-center">Technologies Avancées</p>
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
                  <p className="mt-2 text-lg font-semibold tracking-tight text-gray-950 max-lg:text-center">Confidentialité & Sécurité</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Vos données restent privées et sont utilisées uniquement pour personnaliser votre expérience. Nous suivons des normes strictes pour garantir la sécurité de vos préférences et de votre historique de lecture.
                  </p>
                </div>
                <div className="@container flex flex-1 justify-center items-center max-lg:py-6 lg:pb-2">
                    <Image
                    className="size-36"
                    src={Security}
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
                  <p className="mt-2 text-lg font-semibold tracking-tight text-gray-950 max-lg:text-center">
                    Une expérience fluide et intéractive
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Grâce à une interface fluide et interactive, vous pouvez découvrir de nouveaux livres en quelques clics. Posez une question, partagez vos goûts ou laissez-vous surprendre par des suggestions adaptées en temps réel. Plus vous échangez avec lui, plus il affine ses recommandations pour coller parfaitement à vos envies.
                    Accessible sur différents supports, il s’adapte à votre rythme et transforme la recherche de livres en un moment simple, rapide et agréable.
                  </p>
                </div>
                <div className="">
                  <Image 
                    className='' 
                    src={Frame}
                    alt=''
                  />
                  {/* <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      Futur mockup ou screen présentant le chatbot
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
