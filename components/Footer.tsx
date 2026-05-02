import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-[#F8F8F8] lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6">
          <p className="font-display text-xl font-bold">Pack do Criador</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#F8F8F8]/50">
            Figurinhas premium para Stories, com acesso em área de membros e download direto pelo celular.
          </p>
        </div>
        <div className="col-span-12 flex flex-col gap-2 text-sm text-[#F8F8F8]/50 md:col-span-3">
          <span className="font-semibold text-[#F8F8F8]">Suporte</span>
          <a href="mailto:packdocriador1@gmail.com" className="transition hover:text-[#FF00FF]">
            packdocriador1@gmail.com
          </a>
        </div>
        <div className="col-span-12 flex flex-col gap-2 text-sm text-[#F8F8F8]/50 md:col-span-3">
          <span className="font-semibold text-[#F8F8F8]">Legal</span>
          <span>Compra processada pela Cakto</span>
          <span>Garantia de 7 dias</span>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-[#F8F8F8]/40">
        © 2026 Pack do Criador. Todos os direitos reservados.
      </div>
    </footer>
  )
}
