import React from 'react'
import { Star, Check, ShoppingCart, Smartphone, Clock } from 'lucide-react'

interface HeroProps {
  onCtaClick: () => void
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,216,51,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ffd833]/20 to-[#f943a7]/20 rounded-full border border-[#ffd833]/30 backdrop-blur-sm">
          <Star className="text-[#ffd833] mr-2 h-5 w-5 animate-pulse" />
          <span className="text-[#ffd833] font-semibold text-lg">+ 10.000 figurinhas</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-[#f943a7] to-[#9a50e2] bg-clip-text text-transparent">
            Stories criativos
          </span>
          <br />
          <span className="text-white">com nossos pack</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
          Vem para o time das que fazem stories extraordinários
        </p>
        
        <div className="mb-8 mx-auto max-w-3xl">
          <div className="aspect-video bg-gradient-to-r from-[#9a50e2]/20 to-[#f943a7]/20 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Smartphone className="mx-auto mb-4 h-16 w-16 text-[#ffd833]" />
              <p className="text-gray-400">Imagem ilustrativa será inserida aqui</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onCtaClick}
          className="group relative inline-flex items-center px-12 py-6 text-xl font-bold text-black bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#ffd833]/50 mb-6"
        >
          <ShoppingCart className="mr-3 h-6 w-6 group-hover:animate-pulse" />
          Quero o meu pack
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>
        
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