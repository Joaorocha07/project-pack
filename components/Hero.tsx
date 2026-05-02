import React from 'react'
import { BadgeCheck, Download, LockKeyhole, ShoppingCart, Sparkles } from 'lucide-react'
import Image from 'next/image'
import heroDesktop from '../images/banner-novo.png'
import heroMobile from '../images/banner-story.png'

interface HeroProps {
  onCtaClick: () => void
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="brand-grain relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={heroDesktop}
          alt="Preview visual do Pack do Criador"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hidden object-cover object-center opacity-90 md:block"
        />
        <Image
          src={heroMobile}
          alt="Preview mobile do Pack do Criador"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center opacity-60 md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.74)_38%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(255,0,255,0.05),transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_72%,rgba(248,248,248,0.08),transparent_30%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-12 items-center gap-6 px-6 py-24 lg:px-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F8F8F8] shadow-[0_0_32px_rgba(255,0,255,0.08)]">
            <Sparkles className="h-4 w-4 text-[#F8F8F8]" />
            Para influencers, criadoras e quem quer stories mais bonitos
          </div>

          <h1 className="font-display max-w-4xl text-5xl font-bold leading-[0.98] tracking-normal text-[#F8F8F8] md:text-6xl lg:text-7xl">
            Stories com cara de influencer, mesmo sem saber design.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F8F8F8]/80 md:text-xl">
            Figurinhas prontas para deixar seus stories mais estilosos, engajantes e fáceis de postar, seja para vender, divulgar sua rotina ou deixar o perfil mais profissional.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onCtaClick}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#F8F8F8] px-8 py-4 text-base font-bold text-black shadow-[0_18px_60px_rgba(248,248,248,0.14)] transition duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(248,248,248,0.18)]"
            >
              <ShoppingCart className="h-5 w-5" />
              Quero minhas figurinhas
            </button>
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-base font-semibold text-[#F8F8F8] transition duration-300 ease-out hover:scale-[1.02] hover:border-[#F8F8F8]/70 hover:bg-[#F8F8F8]/10"
            >
              <LockKeyhole className="h-5 w-5 text-[#F8F8F8]" />
              Entrar na área de membros
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Download, label: 'Baixe direto pela área de membros' },
              { icon: BadgeCheck, label: 'Para vender, engajar ou decorar stories' },
              { icon: LockKeyhole, label: 'Acesso protegido e suporte' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 border-l border-[#F8F8F8]/50 pl-4 text-sm leading-5 text-[#F8F8F8]/70">
                <item.icon className="h-5 w-5 shrink-0 text-[#F8F8F8]" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="relative mx-auto mt-8 aspect-[9/16] max-w-[310px] lg:mt-0">
            <div className="absolute -inset-7 rounded-[44px] bg-[#FF00FF]/12 blur-3xl" />
            <div className="absolute -inset-3 rounded-[40px] border border-[#F8F8F8]/20" />
            <Image
              src={heroMobile}
              alt="Banner story do Pack do Criador"
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 310px, 80vw"
              className="relative rounded-[34px] object-cover shadow-[0_30px_90px_rgba(0,0,0,0.65)] ring-1 ring-white/15"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
