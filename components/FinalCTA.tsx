'use client'

import React, { useState } from 'react'
import { CreditCard, DownloadCloud, Loader2, LockKeyhole, ShieldCheck, ShoppingCart } from 'lucide-react'

export default function FinalCTA() {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const benefits = [
    'Mais de 8.000 figurinhas',
    'Área de membros para acessar e baixar',
    'Categorias organizadas por nicho',
    'Pagamento único e acesso vitalício',
    'Suporte por e-mail',
    'Garantia de 7 dias',
  ]

  const handleCheckout = async () => {
    if (isCheckoutLoading) return

    setIsCheckoutLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/checkout/link', {
        method: 'GET',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Nao foi possivel buscar o link de checkout.')
      }

      const data = await response.json()

      if (!data?.url || typeof data.url !== 'string') {
        throw new Error('Link de checkout invalido.')
      }

      const checkoutUrl = new URL(data.url)
      checkoutUrl.searchParams.delete('affiliate')

      window.location.href = checkoutUrl.toString()
    } catch (error) {
      console.error(error)
      setCheckoutError('Nao foi possivel abrir o checkout. Tente novamente em instantes.')
      setIsCheckoutLoading(false)
    }
  }

  return (
    <section id="offer" className="relative overflow-hidden bg-black px-6 py-24 text-[#F8F8F8] md:py-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,0,255,0.07),transparent_38%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_72%,rgba(248,248,248,0.08),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F8F8F8]">
            Oferta do pack
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Comece hoje com uma biblioteca pronta para os seus Stories.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#F8F8F8]/70">
            Você entra na área de membros, abre a categoria desejada e baixa as figurinhas direto no celular.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-[#F8F8F8]/75">
                <span className="h-1.5 w-1.5 bg-[#FF00FF]" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_110px_rgba(0,0,0,0.42)] md:p-10">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F8F8F8]/48">
                  Pack do Criador
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#F8F8F8]">Acesso premium vitalício</h3>
              </div>
              <div className="inline-flex items-center gap-2 border border-[#F8F8F8]/40 bg-[#F8F8F8]/10 px-4 py-2 text-sm font-semibold">
                <DownloadCloud className="h-4 w-4 text-[#F8F8F8]" />
                Entrega por e-mail
              </div>
            </div>

            <div className="py-8">
              <p className="text-[#F8F8F8]/48">
                Valor total <span className="line-through">R$ 57,00</span>
              </p>
              <p className="mt-2 text-lg font-bold text-[#F8F8F8]">Hoje por apenas</p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <span className="font-display text-6xl font-bold leading-none text-[#F8F8F8] md:text-7xl">
                  R$ 29,90
                </span>
                <span className="pb-2 text-lg text-[#F8F8F8]/70">
                  ou 6x de <strong className="text-[#F8F8F8]">R$ 5,73</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#F8F8F8] px-8 py-5 text-base font-bold text-black shadow-[0_18px_60px_rgba(248,248,248,0.14)] transition duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(248,248,248,0.18)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isCheckoutLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              {isCheckoutLoading ? 'Abrindo checkout...' : 'Comprar agora'}
            </button>

            {checkoutError ? (
              <p className="mt-3 text-center text-sm font-semibold text-red-300">
                {checkoutError}
              </p>
            ) : null}

            <div className="mt-7 grid gap-3 text-sm text-[#F8F8F8]/60 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-[#F8F8F8]" />
                Site seguro
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F8F8F8]" />
                Garantia de 7 dias
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#F8F8F8]" />
                Pix, Visa e Mastercard
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#F8F8F8]/50">
              <span>Pix</span>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Compra criptografada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
