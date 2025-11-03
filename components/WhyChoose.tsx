'use client'
import React from 'react'
import { Gift, TrendingUp, Play } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WhyChoose() {
  const cards = [
    {
      icon: <Gift className="h-8 w-8 text-black" />,
      title: '+ 8000 FIGURINHAS',
      color: 'from-[#ffd833] to-[#f943a7]',
      textColor: 'text-[#ffd833]',
      desc: 'Biblioteca completa para todos os seus stories',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: 'TENHA POSICIONAMENTO',
      color: 'from-[#f943a7] to-[#9a50e2]',
      textColor: 'text-[#f943a7]',
      desc: 'Mostre autoridade no Instagram e destaque-se',
    },
    {
      icon: <Play className="h-8 w-8 text-white" />,
      title: 'TRANSFORME SEUS STORIES',
      color: 'from-[#9a50e2] to-[#ffd833]',
      textColor: 'text-[#9a50e2]',
      desc: 'Com poucos cliques, seus stories ficam incríveis',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-black" />,
      title: 'MAIS RESULTADOS',
      color: 'from-[#ffd833] to-[#f943a7]',
      textColor: 'text-[#ffd833]',
      desc: (
        <div className="space-y-2 text-sm mt-4">
          <p className="text-[#f943a7] font-semibold">+ ENGAJAMENTO</p>
          <p className="text-[#9a50e2] font-semibold">+ VISUALIZAÇÕES</p>
          <p className="text-[#ffd833] font-semibold">+ VENDAS</p>
        </div>
      ),
    },
  ]

  return (
    <section className="relative py-28 px-4 md:px-10 overflow-hidden bg-[#05000a] text-white">
      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 px-4"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Por que escolher o{' '}
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,67,167,0.3)]">
              Pack do Criador
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Tudo o que você precisa para transformar seu conteúdo em algo memorável.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center w-full max-w-6xl">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.07,
                rotateY: 3,
                boxShadow: '0 0 30px rgba(255,216,51,0.25)',
              }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group flex flex-col items-center text-center w-full sm:w-[90%] md:w-[85%] lg:w-full p-8 sm:p-10 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#ffd833]/40 transition-all duration-300"
            >
              {/* Glow de fundo */}
              <div
                className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${card.color} opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300`}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`mb-6 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${card.color} rounded-full shadow-[0_0_25px_rgba(255,255,255,0.15)]`}
                >
                  {card.icon}
                </div>
                <h3 className={`text-xl md:text-2xl font-bold ${card.textColor} mb-2`}>
                  {card.title}
                </h3>
                {typeof card.desc === 'string' ? (
                  <p className="text-gray-400 text-sm md:text-base max-w-xs">
                    {card.desc}
                  </p>
                ) : (
                  card.desc
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
