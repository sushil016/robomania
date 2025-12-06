'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const highlights = [
  { 
    id: 1, 
    src: '/highlights/WhatsApp Image 2025-12-06 at 03.57.35.jpeg',
    alt: 'RoboMania Event Highlight 1',
    title: 'Championship Battle',
    description: 'Witness the epic finale of RoboMania'
  },
  { 
    id: 2, 
    src: '/highlights/WhatsApp Image 2025-12-06 at 03.57.36 (1).jpeg',
    alt: 'RoboMania Event Highlight 2',
    title: 'Arena Combat',
    description: 'High-intensity robot battles in our state-of-the-art arena'
  },
  { 
    id: 3, 
    src: '/highlights/WhatsApp Image 2025-12-06 at 03.57.38 (1).jpeg',
    alt: 'RoboMania Event Highlight 3',
    title: 'Team Spirit',
    description: 'Collaborative engineering at its finest'
  },
  { 
    id: 4, 
    src: '/highlights/WhatsApp Image 2025-12-06 at 03.57.42.jpeg',
    alt: 'RoboMania Event Highlight 4',
    title: 'Innovation',
    description: 'Pushing the boundaries of robot design and technology'
  },
  { 
    id: 5, 
    src: '/highlights/WhatsApp Image 2025-12-06 at 03.57.43 (1).jpeg',
    alt: 'RoboMania Event Highlight 5',
    title: 'Technical Excellence',
    description: 'Showcasing advanced robotics technology'
  },
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
    <section className="py-24 relative overflow-hidden bg-black">
      {/* Black gradient background instead of hero image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold font-orbitron text-center mb-12"
        >
          <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
            Event Highlights
          </span>
        </motion.h2>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[16/9]"
              >
                <Image
                  src={highlights[currentIndex].src}
                  alt={highlights[currentIndex].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold font-orbitron text-white mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  >
                    {highlights[currentIndex].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    {highlights[currentIndex].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white/95 transition-colors duration-200"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white/95 transition-colors duration-200"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {highlights.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-[#FF4500] to-[#00CED1]' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

