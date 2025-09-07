'use client'

import React, { useState, useEffect } from 'react'
import { Smartphone } from 'lucide-react'

export default function Demo() {
  const [currentDemo, setCurrentDemo] = useState(0)

  const demoPages = [
    { title: "Frases Motivacionais", phones: 2 },
    { title: "Stories de Vendas", phones: 2 },
    { title: "Conteúdo Fashion", phones: 2 },
    { title: "Posts Inspiracionais", phones: 2 },
    { title: "Stories Criativos", phones: 2 }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoPages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Veja como ficam nossas
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> figurinhas nos stories</span>
          </h2>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-2">
            {demoPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDemo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentDemo === index ? 'bg-[#ffd833]' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-[#f943a7]">
            {demoPages[currentDemo]?.title}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="mx-auto">
              <div className="relative w-48 h-80 bg-gradient-to-b from-gray-800 to-black rounded-3xl border-4 border-gray-700 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                <div className="mt-8 p-4 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="mx-auto mb-2 h-12 w-12 text-[#ffd833]" />
                    <p className="text-xs text-gray-400">Story {index + 1}</p>
                    <p className="text-xs text-gray-500 mt-1">1080x1920</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}