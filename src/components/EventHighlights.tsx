'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const highlights = [
  { id: 1, src: '/highlight1.jpg', alt: 'RoboMania 2024 Winner' },
  { id: 2, src: '/highlight2.jpg', alt: 'Exciting Robot Battle' },
  { id: 3, src: '/highlight3.jpg', alt: 'Team Collaboration' },
  { id: 4, src: '/highlight4.jpg', alt: 'Innovative Robot Design' },
]

export default function EventHighlights() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % highlights.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + highlights.length) % highlights.length)
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-orbitron text-neon-green mb-8 text-center">Event Highlights</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {highlights.map((highlight) => (
                <div key={highlight.id} className="w-full flex-shrink-0">
                  <Image
                    src={highlight.src}
                    alt={highlight.alt}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors duration-200"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors duration-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

