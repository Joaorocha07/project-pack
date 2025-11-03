import React from 'react'
import { Star, Check, ShoppingCart, Clock } from 'lucide-react'
import ImageTeste from '../images/banner-site-pc.png'
import Image from 'next/image'

interface HeroProps {
  onCtaClick: () => void
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0015] py-6">
      {/* ✨ Fundo principal com gradientes dinâmicos */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c002f] via-[#0a0015] to-[#11001f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,73,167,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,216,51,0.1),transparent_80%)]" />

      {/* ✨ Efeitos de luz animados */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#f943a7]/20 to-[#ffd833]/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-gradient-to-tr from-[#ffd833]/10 to-[#f943a7]/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* 💫 Linhas decorativas */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(0deg,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge superior */}
        <div className="mb-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ffd833]/10 to-[#f943a7]/10 rounded-full border border-[#ffd833]/30 backdrop-blur-sm shadow-md">
          <Star className="text-[#ffd833] mr-2 h-5 w-5 animate-spin-slow" />
          <span className="text-[#ffd833] font-semibold text-lg">+ 10.000 figurinhas</span>
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-[#f943a7] to-[#9a50e2] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,67,167,0.3)]">
            Stories criativos
          </span>
          <br />
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">com pack do criador</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
          Vem para o time das que fazem stories extraordinários
        </p>

        {/* Imagem central */}
        <div className="relative mb-8 mx-auto max-w-3xl">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#ffd833]/20 to-[#f943a7]/20 blur-2xl rounded-3xl animate-pulse-slow" />
          <Image
            src={ImageTeste}
            alt="Imagem ilustrativa 1"
            width={700}
            height={300}
            className="relative rounded-xl object-contain mx-auto shadow-[0_0_40px_rgba(249,67,167,0.25)]"
          />
        </div>

        {/* Botão CTA */}
        <button
          onClick={onCtaClick}
          className="group relative inline-flex items-center px-12 py-6 text-xl font-bold text-black bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#ffd833]/50 mb-6"
        >
          <ShoppingCart className="mr-3 h-6 w-6 group-hover:animate-pulse" />
          Quero o meu pack
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>

        {/* Rodapé de info */}
        <div className="flex items-center justify-center space-x-6 text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-[#ffd833]" />
            Otimize o tempo
          </div>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-[#9a50e2]" />
            Todas figurinhas validadas
          </div>
        </div>
      </div>
    </section>
  )
}
