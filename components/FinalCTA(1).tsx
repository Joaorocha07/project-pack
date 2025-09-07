import React from 'react'
import { Clock, Check, ShoppingCart } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section id="offer" className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full border border-red-500/30 backdrop-blur-sm animate-pulse">
          <Clock className="text-red-400 mr-2 h-5 w-5" />
          <span className="text-red-400 font-semibold">ÚLTIMAS VAGAS DISPONÍVEIS!</span>
        </div>
        
        <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-12 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent">
              EU QUERO
            </span>
          </h2>
          
          <div className="grid md:grid-cols-5 gap-6 mb-12 text-left">
            <div className="flex items-center">
              <Check className="text-[#ffd833] mr-3 h-6 w-6 flex-shrink-0" />
              <span>+ 8000 Figurinhas</span>
            </div>
            <div className="flex items-center">
              <Check className="text-[#f943a7] mr-3 h-6 w-6 flex-shrink-0" />
              <span>Molduras e Sombras</span>
            </div>
            <div className="flex items-center">
              <Check className="text-[#9a50e2] mr-3 h-6 w-6 flex-shrink-0" />
              <span>Acesso imediato no email</span>
            </div>
            <div className="flex items-center">
              <Check className="text-[#ffd833] mr-3 h-6 w-6 flex-shrink-0" />
              <span>Video de como usar</span>
            </div>
            <div className="flex items-center">
              <Check className="text-[#f943a7] mr-3 h-6 w-6 flex-shrink-0" />
              <span>Pagamento Único</span>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-400 text-lg mb-2">VALOR TOTAL: <span className="line-through">R$ 97,00</span></p>
            <p className="text-2xl font-bold mb-4">MAS SÓ HOJE POR APENAS</p>
            <div className="text-6xl font-bold bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent mb-4">
              R$ 15,00
            </div>
            <p className="text-xl text-gray-300">ou 2x de <span className="text-[#ffd833] font-bold">R$ 7,84</span></p>
            <p className="text-sm text-gray-400 mt-2">*PAGAMENTO ÚNICO</p>
          </div>
          
          <button className="group relative inline-flex items-center px-16 py-6 text-2xl font-bold text-black bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#ffd833]/50">
            <ShoppingCart className="mr-3 h-8 w-8 group-hover:animate-pulse" />
            COMPRAR AGORA
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>
        </div>
      </div>
    </section>
  )
}