import React from 'react'
import { Clock, Check, ShoppingCart } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section
      id="offer"
      className="relative py-20 px-6 sm:px-10 bg-gradient-to-b from-[#0a0015] via-[#15001e] to-black overflow-hidden"
    >
      {/* 💫 Fundo de destaque com brilho suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,67,167,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,216,51,0.07),transparent_70%)]" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* 🔥 Glow no fundo do card */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-[#f943a7]/10 to-[#ffd833]/10 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge de urgência */}
        <div className="mb-10 inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#f943a7]/20 to-[#ffd833]/20 rounded-full border border-[#f943a7]/40 backdrop-blur-md shadow-md animate-pulse">
          <Clock className="text-[#ffd833] mr-2 h-5 w-5" />
          <span className="text-[#ffd833] font-semibold uppercase tracking-wider">
            ÚLTIMAS VAGAS DISPONÍVEIS!
          </span>
        </div>

        {/* Card central */}
        <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-10 sm:p-12 shadow-[0_0_50px_rgba(249,67,167,0.2)] backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent">
              EU QUERO
            </span>{' '}
            O PACK DO CRIADOR
          </h2>

          {/* Benefícios */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 text-left max-w-2xl mx-auto">
            {[
              ['+ 8000 Figurinhas', '#ffd833'],
              ['Molduras e Sombras', '#f943a7'],
              ['Acesso imediato no e-mail', '#9a50e2'],
              ['Vídeo de como usar', '#ffd833'],
              ['Pagamento Único', '#f943a7'],
              ['Suporte direto por e-mail', '#9a50e2'],
            ].map(([text, color], i) => (
              <div
                key={i}
                className="flex items-center bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <Check
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  style={{ color }}
                />
                <span className="text-gray-200">{text}</span>
              </div>
            ))}
          </div>

          {/* Preço */}
          <div className="mb-8">
            <p className="text-gray-400 text-lg mb-2">
              VALOR TOTAL:{' '}
              <span className="line-through text-gray-500">R$ 57,00</span>
            </p>
            <p className="text-2xl font-bold mb-4 text-white">
              MAS SÓ HOJE POR APENAS
            </p>
            <div className="flex justify-center items-baseline mb-1">
              <span className="text-5xl font-extrabold bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,216,51,0.3)] whitespace-nowrap">
                R$ 23,90
              </span>
            </div>
            <p className="text-xl text-gray-300">
              ou 2x de{' '}
              <span className="text-[#ffd833] font-bold">R$ 13,37</span>
            </p>
            <p className="text-sm text-gray-400 mt-2 italic">
              *Pagamento único, acesso vitalício
            </p>
          </div>

          {/* Botão principal */}
          <div className="relative inline-flex w-full sm:w-auto justify-center">
            <a
              href="https://pay.cakto.com.br/wjzbfzc_596335"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 md:px-14 md:py-6 
                        text-base sm:text-lg md:text-xl font-bold text-black 
                        bg-gradient-to-r from-[#ffd833] to-[#f943a7] 
                        rounded-full transition-transform duration-300 
                        hover:scale-105 shadow-2xl hover:shadow-[#ffd833]/50 focus:outline-none"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 group-hover:animate-pulse" />
              <span className="whitespace-nowrap tracking-wide">COMPRAR AGORA</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </a>
          </div>
        </div>

        {/* Garantia e segurança */}
        <div className="mt-10 text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-4">
          <p>✔ Compra 100% segura e criptografada</p>
          <span className="hidden sm:inline-block">•</span>
          <p>📩 Entrega automática no e-mail após pagamento</p>
        </div>
      </div>
    </section>
  )
}
