import React from 'react'
import { Gift, TrendingUp, Play } from 'lucide-react'

export default function WhyChoose() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por que escolher o
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> + Criativa Pack</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-[#ffd833]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full">
              <Gift className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-[#ffd833] mb-2">+ 8000 FIGURINHAS</h3>
            <p className="text-gray-400">Biblioteca completa para todos os seus stories</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-[#f943a7]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#f943a7] to-[#9a50e2] rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#f943a7] mb-2">TER POSICIONAMENTO</h3>
            <p className="text-gray-400">no Instagram</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-[#9a50e2]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#9a50e2] to-[#ffd833] rounded-full">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#9a50e2] mb-2">TRANSFORME</h3>
            <p className="text-gray-400">seus Stories em poucos cliques</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-[#ffd833]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full">
              <TrendingUp className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-[#ffd833] mb-4">MAIS RESULTADOS</h3>
            <div className="space-y-2 text-sm">
              <p className="text-[#f943a7]">+ ENGAJAMENTO</p>
              <p className="text-[#9a50e2]">+ VISUALIZAÇÕES</p>
              <p className="text-[#ffd833]">+ VENDAS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}