import React from 'react'

export default function Niches() {
  const niches = [
    'Influencer', 'Lifestyle', 'Loja feminina', 'Estética', 'Nail designer', 'Confeitaria',
    'Marketing digital', 'Fitness', 'Bronzeamento', 'Cafés', 'Achadinhos', 'Frases universais',
    'Caixinha de perguntas', 'Datas comemorativas', 'Sobrancelhas', 'Maquiagem', 'Rotina', 'Agenda e avisos',
  ]

  return (
    <section className="relative overflow-hidden bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(248,248,248,0.08),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Categorias
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Packs para vários estilos de conteúdo.
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {niches.map((niche) => (
              <div
                key={niche}
                className="flex min-h-[72px] items-center border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-[#F8F8F8] shadow-[0_12px_45px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.055]"
              >
                {niche}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[#F8F8F8]/60">
            As categorias aparecem organizadas na área de membros para acessar, visualizar e baixar as figurinhas quando precisar.
          </p>
        </div>
      </div>
    </section>
  )
}
