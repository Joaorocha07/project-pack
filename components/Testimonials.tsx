'use client'

import React from 'react'
import Image from 'next/image'
import ImageClienteUm from '@/images/foto-cliente-1.webp'
import ImageClienteDois from '@/images/foto-cliente-2.webp'
import ImageClienteTres from '@/images/foto-cliente-3.webp'
import { BadgeCheck, MessageCircle } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ana Dellai',
      username: '@anadellai_music',
      metric: 'Stories mais profissionais em 1 tarde',
      text: 'Eu não precisava de mais um curso. Precisava de peças prontas para postar sem perder tempo ajustando tudo.',
      avatar: ImageClienteUm,
    },
    {
      name: 'Ana Laura',
      username: '@lips.stargirl',
      metric: 'Mais agilidade na rotina de conteúdo',
      text: 'Uso para chamada, caixinha, aviso de agenda e oferta. Fica bonito e combina com qualquer foto do story.',
      avatar: ImageClienteDois,
    },
    {
      name: 'Laryssa Rocha',
      username: '@_laryznx1',
      metric: 'Pack organizado por nichos',
      text: 'A área de membros facilita muito. Entro, escolho a categoria e baixo as figurinhas que fazem sentido para o dia.',
      avatar: ImageClienteTres,
    },
  ]

  return (
    <section className="bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
              Criadoras usando na prática
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Mais presença no Instagram, sem depender de design do zero.
            </h2>
          </div>
          <div className="col-span-12 flex items-end lg:col-span-7">
            <p className="max-w-2xl text-lg leading-8 text-[#F8F8F8]/70">
              O pack foi feito para influencers, empreendedoras e pessoas comuns que querem postar com frequência e manter um visual consistente.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.username} className="border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/35">
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#F8F8F8]">{testimonial.name}</h3>
                  <p className="text-sm text-[#F8F8F8]/56">{testimonial.username}</p>
                </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 border border-[#F8F8F8]/40 bg-[#F8F8F8]/10 px-3 py-2 text-sm font-semibold text-[#F8F8F8]">
                <BadgeCheck className="h-4 w-4 text-[#F8F8F8]" />
                {testimonial.metric}
              </div>
              <p className="mt-5 leading-7 text-[#F8F8F8]/70">{testimonial.text}</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-[#F8F8F8]/50">
                <MessageCircle className="h-4 w-4" />
                Feedback de cliente
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
