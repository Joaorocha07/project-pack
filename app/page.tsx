"use client"

import FAQ from "@/components/FAQ"
import FinalCTA from "@/components/FinalCTA"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import HowToUse from "@/components/HowToUse"
import Niches from "@/components/Niches"
import Testimonials from "@/components/Testimonials"
import WhyChoose from "@/components/WhyChoose"
import Stickers from "./components/Stickers"


export default function Home() {
  const scrollToOffer = () => {
    const offerSection = document.getElementById('offer')
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero onCtaClick={scrollToOffer} />
      <WhyChoose />
      <Stickers />
      <HowToUse />
      <Testimonials />
      <Niches />
      <FinalCTA />
      <FAQ />
      <Footer />
    </div>
  )
}