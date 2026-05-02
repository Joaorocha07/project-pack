'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como recebo o Pack do Criador?',
      answer: 'Após a confirmação do pagamento, você recebe as credenciais por e-mail para entrar na área de membros e baixar as figurinhas.',
    },
    {
      question: 'O pagamento é mensal?',
      answer: 'Não. O pagamento é único e o acesso ao pack é vitalício, sem assinatura mensal.',
    },
    {
      question: 'Consigo baixar pelo celular?',
      answer: 'Sim. A área de membros é responsiva para você abrir pelo celular, escolher a categoria e baixar as figurinhas direto no aparelho.',
    },
    {
      question: 'Tem garantia?',
      answer: 'Sim. Você conta com garantia de 7 dias, conforme as regras da plataforma de pagamento.',
    },
    {
      question: 'Preciso saber design para usar?',
      answer: 'Não. As figurinhas já vêm prontas para aplicar nos stories. Você só escolhe a peça, baixa e usa.',
    },
  ]

  return (
    <section className="bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Dúvidas
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Antes de comprar, o essencial.
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold text-[#F8F8F8] transition hover:text-[#FF00FF]"
                  >
                    {faq.question}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#F8F8F8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden text-base leading-7 text-[#F8F8F8]/70">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
