'use client'

import React from 'react'
import { DownloadCloud, Folders, TrendingUp, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WhyChoose() {
  const features = [
    {
      icon: Wand2,
      title: 'Stories com visual de influencer',
      desc: 'Figurinhas, molduras e sombras para deixar posts comuns com acabamento de conteúdo bem produzido.',
    },
    {
      icon: Folders,
      title: 'Tudo separado por categoria',
      desc: 'A área de membros organiza os packs por nicho para você achar, abrir e baixar o que precisa em poucos cliques.',
    },
    {
      icon: TrendingUp,
      title: 'Mais ritmo para aparecer todos os dias',
      desc: 'Use para rotina, bastidores, divulgação, ofertas, provas sociais e chamadas sem travar na parte visual.',
    },
    {
      icon: DownloadCloud,
      title: 'Download direto no celular',
      desc: 'Comprou, recebeu o acesso por e-mail, entrou na área de membros e baixou as figurinhas protegidas.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(138,43,226,0.08),transparent_32%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="col-span-12 lg:col-span-5"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Feito para aparecer melhor
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-[#F8F8F8] md:text-5xl">
            O visual dos seus Stories não precisa começar do zero.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#F8F8F8]/70">
            O Pack do Criador resolve a parte visual para você focar na mensagem: vender, engajar, mostrar sua rotina ou simplesmente deixar seus stories mais estilosos.
          </p>
        </motion.div>

        <div className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="group border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.2)] transition duration-300 ease-out hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.055]"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center border border-[#F8F8F8]/50 bg-[#F8F8F8]/10">
                <feature.icon className="h-5 w-5 text-[#F8F8F8]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8F8F8]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[#F8F8F8]/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
