import React from 'react'
import { Mail, MousePointerClick, Smartphone } from 'lucide-react'

export default function HowToUse() {
  const steps = [
    {
      icon: Mail,
      title: 'Receba o acesso',
      desc: 'Depois da confirmação do pagamento, o acesso chega no e-mail usado na compra.',
    },
    {
      icon: MousePointerClick,
      title: 'Entre na área de membros',
      desc: 'Abra a plataforma, escolha uma categoria e visualize as figurinhas do pack.',
    },
    {
      icon: Smartphone,
      title: 'Baixe e use nos Stories',
      desc: 'Salve no celular e aplique em stories de rotina, looks, ofertas, caixinhas e chamadas do dia.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,248,248,0.03),transparent_38%,rgba(255,0,255,0.04))]" />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Área de membros
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Comprou, entrou, baixou.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#F8F8F8]/70">
            A experiência foi pensada para ser simples: nada de arquivo perdido em conversa ou link confuso.
          </p>
        </div>

        <div className="col-span-12 grid gap-4 md:grid-cols-3 lg:col-span-8">
          {steps.map((step, index) => (
            <div key={step.title} className="border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_70px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/35">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center border border-[#F8F8F8]/50 bg-[#F8F8F8]/10 text-[#F8F8F8]">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-5xl font-bold text-white/10">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-[#F8F8F8]/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
