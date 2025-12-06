'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ImageItem {
  src: string
  alt: string
}

interface ScrollingImageGridProps {
  images: ImageItem[]
}

export default function ScrollingImageGrid({ images }: ScrollingImageGridProps) {
  const [duplicatedImages, setDuplicatedImages] = useState<ImageItem[]>([])

  useEffect(() => {
    // Duplicate images for infinite scroll
    setDuplicatedImages([...images, ...images, ...images])
  }, [images])

  // Split images into 3 columns with uneven heights
  const column1 = duplicatedImages.filter((_, i) => i % 3 === 0)
  const column2 = duplicatedImages.filter((_, i) => i % 3 === 1)
  const column3 = duplicatedImages.filter((_, i) => i % 3 === 2)

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Gradient overlays for smooth fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Column 1 - Scrolls down */}
        <motion.div
          className="flex flex-col gap-4"
          animate={{
            y: [0, -1000],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {column1.map((image, index) => (
            <div
              key={`col1-${index}`}
              className="relative group overflow-hidden rounded-xl"
              style={{ height: index % 2 === 0 ? '250px' : '350px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Column 2 - Scrolls up */}
        <motion.div
          className="flex flex-col gap-4"
          animate={{
            y: [-1000, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {column2.map((image, index) => (
            <div
              key={`col2-${index}`}
              className="relative group overflow-hidden rounded-xl"
              style={{ height: index % 2 === 0 ? '300px' : '280px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Column 3 - Scrolls down (hidden on mobile) */}
        <motion.div
          className="hidden md:flex flex-col gap-4"
          animate={{
            y: [0, -1000],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 22,
              ease: "linear",
            },
          }}
        >
          {column3.map((image, index) => (
            <div
              key={`col3-${index}`}
              className="relative group overflow-hidden rounded-xl"
              style={{ height: index % 2 === 0 ? '320px' : '260px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
