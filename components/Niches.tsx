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
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nichos do
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> pack</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {niches.map((niche, index) => (
            <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/0 border border-white/10 hover:border-[#ffd833]/50 transition-all duration-300 hover:transform hover:scale-105 text-center">
              <p className="text-white font-medium">{niche}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}