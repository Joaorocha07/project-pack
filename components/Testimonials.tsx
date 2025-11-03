'use client'

import React from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ana Silva",
      username: "@anabela_insta",
      text: "Minhas vendas aumentaram 300% depois que comecei a usar essas figurinhas! Stories muito mais profissionais.",
      likes: 127,
      avatar: "AS"
    },
    {
      name: "Carla Santos", 
      username: "@carlasantos_",
      text: "Que pack incrível! Economizo horas criando stories agora. Super recomendo para todas as empreendedoras!",
      likes: 89,
      avatar: "CS"
    },
    {
      name: "Marina Costa",
      username: "@marinacosta",
      text: "Estava procurando algo assim há muito tempo. Figurinhas de qualidade e muito fácil de usar. Amei! 💕",
      likes: 156,
      avatar: "MC"
    }
  ]

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[#05000a] text-white">
      {/* 🌌 Fundo animado estilo WhyChoose */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c002f] via-[#0a0015] to-[#11001f] animate-gradientMove" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,73,167,0.25),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(255,216,51,0.2),transparent_70%)]" />

      {/* ✨ Partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-2 h-2 rounded-full bg-gradient-to-r from-[#ffd833] to-[#f943a7] opacity-30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            O que falam sobre{' '}
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,67,167,0.3)]">
              Pack do Criador
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Clientes reais mostrando resultados incríveis com o pack.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 
                         hover:border-[#ffd833]/40 hover:shadow-[0_0_25px_rgba(255,216,51,0.25)] 
                         transition-all duration-300 hover:scale-[1.03]"
            >
              {/* Glow de fundo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd833] to-[#f943a7] opacity-10 rounded-2xl blur-xl" />

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full flex items-center justify-center text-black font-bold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.username}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{testimonial.text}</p>

                <div className="flex items-center space-x-4 text-gray-400">
                  <button className="flex items-center space-x-1 hover:text-[#f943a7] transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>{testimonial.likes}</span>
                  </button>
                  <button className="hover:text-[#ffd833] transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button className="hover:text-[#9a50e2] transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
