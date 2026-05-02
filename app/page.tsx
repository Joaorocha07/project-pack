"use client"

import { useEffect, useState } from "react"
import FAQ from "@/components/FAQ"
import FinalCTA from "@/components/FinalCTA"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import HowToUse from "@/components/HowToUse"
import Niches from "@/components/Niches"
import Testimonials from "@/components/Testimonials"
import WhyChoose from "@/components/WhyChoose"
import Stickers from "./components/Stickers"
import { ShoppingCart } from "lucide-react"

export default function Home() {
  const [showStickyCta, setShowStickyCta] = useState(false)

  const scrollToOffer = () => {
    const offerSection = document.getElementById('offer')
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setShowStickyCta(scrollable > 0 && window.scrollY / scrollable > 0.5)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-[#F8F8F8]">
      <Hero onCtaClick={scrollToOffer} />
      <WhyChoose />
      <Stickers />
      <HowToUse />
      <Testimonials />
      <Niches />
      <FinalCTA />
      <FAQ />
      <Footer />
      <button
        type="button"
        onClick={scrollToOffer}
        className={`fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-full bg-[#F8F8F8] px-5 py-4 text-sm font-bold text-black shadow-[0_18px_50px_rgba(248,248,248,0.16)] transition-all duration-300 md:hidden ${
          showStickyCta ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <ShoppingCart className="h-4 w-4" />
        Comprar Pack do Criador
      </button>
    </div>
  )
}
