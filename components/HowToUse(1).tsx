import React from 'react'
import { Download, Users, Shield } from 'lucide-react'

export default function HowToUse() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            E pra utilizar é
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> muito fácil</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-[#ffd833]/10 to-transparent border border-[#ffd833]/20 hover:border-[#ffd833]/50 transition-all duration-300">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full">
              <Download className="h-10 w-10 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#ffd833]">1. Baixe no celular</h3>
            <p className="text-gray-400">As figurinhas são adesivos para colar nos seus stories, é só baixá-las no seu celular</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-[#f943a7]/10 to-transparent border border-[#f943a7]/20 hover:border-[#f943a7]/50 transition-all duration-300">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#f943a7] to-[#9a50e2] rounded-full">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#f943a7]">2. Área de membros</h3>
            <p className="text-gray-400">Você recebe acesso à uma área onde as figurinhas estão separadas por nichos no Drive ou Telegram</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-[#9a50e2]/10 to-transparent border border-[#9a50e2]/20 hover:border-[#9a50e2]/50 transition-all duration-300">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#9a50e2] to-[#ffd833] rounded-full">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#9a50e2]">3. Suporte completo</h3>
            <p className="text-gray-400">E ainda suporte pra te ensinar o passo a passo para utilizar de maneira correta</p>
          </div>
        </div>
      </div>
    </section>
  )
}