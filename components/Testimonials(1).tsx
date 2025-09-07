import React from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ana Silva",
      username: "@anabela_insta",
      text: "Minhas vendas aumentaram 300% depois que comecei a usar essas figurinhas! Stories muito mais profissionais.",
      likes: 127,
      avatar: "AS"
    },
    {
      name: "Carla Santos", 
      username: "@carlasantos_",
      text: "Que pack incrível! Economizo horas criando stories agora. Super recomendo para todas as empreendedoras!",
      likes: 89,
      avatar: "CS"
    },
    {
      name: "Marina Costa",
      username: "@marinacosta",
      text: "Estava procurando algo assim há muito tempo. Figurinhas de qualidade e muito fácil de usar. Amei! 💕",
      likes: 156,
      avatar: "MC"
    }
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que falam sobre
            <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> nosso pack</span>
          </h2>
        </div>
        
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="max-w-md mx-auto bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 hover:border-[#ffd833]/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffd833] to-[#f943a7] rounded-full flex items-center justify-center text-black font-bold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.username}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{testimonial.text}</p>
              
              <div className="flex items-center space-x-4 text-gray-400">
                <button className="flex items-center space-x-1 hover:text-[#f943a7] transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>{testimonial.likes}</span>
                </button>
                <button className="hover:text-[#ffd833] transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button className="hover:text-[#9a50e2] transition-colors">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}