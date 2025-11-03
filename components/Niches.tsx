import React from 'react'

export default function Niches() {
  const niches = [
    "Ano novo", "Agronomia", "Artesanato", "Balão", "Bom dia", "Boa tarde/Boa noite",
    "Bronzeamento", "Blogueira", "Café", "Caixinha de Pergunta", "Caixinha de vidro",
    "Chá da tarde", "Clientes", "Confeitaria", "Cristã", "Depilação", "Dias da semana",
    "Dieta", "Diversas", "Dona de Casa", "Efeito transparente", "Elementos", "Estética",
    "Familía", "Férias", "Fitness", "Frases universais", "Loja", "Maquiagem", "Maquina Ton",
    "Marketing Digital", "Meses", "Moldura", "Nail Designer (Unhas)", "Natal", "Neon",
    "Nutrição", "Emojis", "Rede Social", "Sobrancelha", "Lash Desgner (cílios)",
    "Trabalho", "Salão de Beleza"
  ]

  return (
    <section className="py-20 px-6 bg-[#05000a] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nichos do{' '}
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent">
              pack
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Escolha o nicho ideal e crie stories que falam diretamente com seu público.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {niches.map((niche, index) => (
            <div
              key={index}
              className={`group relative p-4 rounded-2xl text-center font-medium text-white transition-all duration-300
                bg-white/5 backdrop-blur-md border border-white/10
                hover:scale-105 hover:border-[#ffd833]/40 hover:shadow-[0_0_20px_rgba(255,216,51,0.2)]
                hover:text-[#ffd833]`}
            >
              {/* Brilho dinâmico de fundo */}
              <div
                className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#ffd833] via-[#f943a7] to-[#9a50e2]
                opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
              />
              {/* Conteúdo */}
              <div className="relative z-10 flex items-center justify-center min-h-[80px]">
                <p className="text-base md:text-lg tracking-wide">{niche}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
