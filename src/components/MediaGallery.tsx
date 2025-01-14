'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const images = [
  { id: 1, src: '/gallery1.jpg', alt: 'Robot in action' },
  { id: 2, src: '/gallery2.jpg', alt: 'Team working on their robot' },
  { id: 3, src: '/gallery3.jpg', alt: 'Aerial view of the arena' },
  { id: 4, src: '/gallery4.jpg', alt: 'Close-up of robot components' },
  { id: 5, src: '/gallery5.jpg', alt: 'Participants celebrating' },
  { id: 6, src: '/gallery6.jpg', alt: 'Judges evaluating a robot' },
]

export default function MediaGallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-orbitron text-neon-green mb-8 text-center">Media Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-w-16 aspect-h-9 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-3xl max-h-full">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-neon-green"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

