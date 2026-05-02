'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Images } from 'lucide-react'

import sticker01 from '../../images/figurinha01.webp'
import sticker02 from '../../images/figurinha02.webp'
import sticker03 from '../../images/figurinha05.webp'
import sticker04 from '../../images/figurinha03.webp'
import sticker05 from '../../images/figurinha04.webp'

export default function Stickers() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 3200, stopOnInteraction: false })]
  )

  const stickers = [
    { id: 1, title: 'Story com chamada visual', image: sticker01 },
    { id: 2, title: 'Figurinha para oferta', image: sticker02 },
    { id: 3, title: 'Destaque para caixinha', image: sticker03 },
    { id: 4, title: 'Elemento para bastidor', image: sticker04 },
    { id: 5, title: 'Acabamento premium', image: sticker05 },
  ]

  return (
    <section id="depoimentos" className="relative overflow-hidden bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,0,255,0.06),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#F8F8F8]/50 bg-[#F8F8F8]/10">
            <Images className="h-5 w-5" />
          </div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Preview do produto
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Figurinhas para stories de venda, rotina e engajamento.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#F8F8F8]/70">
            Para influencers, empreendedoras e pessoas comuns que querem postar com mais estilo sem ficar montando arte do zero.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="min-w-0 flex-[0_0_78%] border border-white/10 bg-white/[0.035] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:flex-[0_0_42%] lg:flex-[0_0_31%]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-zinc-950">
                    <Image
                      src={sticker.image}
                      alt={sticker.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="px-2 py-4 text-sm font-semibold text-[#F8F8F8]/90">{sticker.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
