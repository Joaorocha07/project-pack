import React, { useState } from 'react'

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "Pagamento é mensal?",
      answer: "Não, o pagamento é único, ou seja, só paga uma vez e tem acesso."
    },
    {
      question: "Por quanto tempo terei acesso?",
      answer: "O acesso é vitalício! Ao adquirir o pack, você garante acesso permanente, sem limite de tempo."
    },
    {
      question: "Como vou receber meu produto?",
      answer: "Será enviado o acesso para o seu e-mail logo após a confirmação do pagamento."
    },
    {
      question: "Tem suporte?",
      answer: "Sim, temos suporte para te auxiliar a usar o pack e tirar qualquer dúvida"
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent">
              Dúvidas Frequentes
            </span>
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-r from-white/5 to-white/0">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-8 py-6 text-left font-semibold text-lg hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                {faq.question}
                <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-[#ffd833]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFaq === index && (
                <div className="px-8 pb-6 text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}