'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import avaliacao01 from '../../images/figurinha01.png'
import avaliacao02 from '../../images/figurinha02.png'
import avaliacao03 from '../../images/figurinha05.png'
import avaliacao04 from '../../images/figurinha03.png'
import avaliacao05 from '../../images/figurinha05.png'

export default function Stickers() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: false,
      align: 'center',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      }
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )


  const testimonials = [
    {
      id: 1,
      title: 'Cliente 1',
      image: avaliacao01,
    },
    {
      id: 2,
      title: 'Cliente 2',
      image: avaliacao02,
    },
    {
      id: 3,
      title: 'Cliente 3',
      image: avaliacao03,
    },
    {
      id: 4,
      title: 'Cliente 4',
      image: avaliacao04,
    },
    {
      id: 5,
      title: 'Cliente 5',
      image: avaliacao05,
    }
  ]
  return (
    <section id="depoimentos" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900/50">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#ffa800]/5 rounded-full blur-3xl"></div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Veja como ficam nossas
        <span className="bg-gradient-to-r from-[#ffd833] to-[#f943a7] bg-clip-text text-transparent"> figurinhas nos stories</span>
        </h2>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto mb-12">
          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-64 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div 
                    className="w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium"
                    style={{ aspectRatio: '1080/1920' }}
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.title}
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}