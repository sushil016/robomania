'use client'


import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Expand } from 'lucide-react'

const mediaItems = [
  {
    id: 1,
    type: 'image',
    src: '/battlebots.jpg',
    alt: 'Battle Robot Arena',
    title: 'Arena Showdown'
  },
  {
    id: 2,
    type: 'video',
    thumbnail: '/battlebots.jpg',
    src: '/video1.mp4',
    alt: 'Robot Battle Highlights',
    title: 'Best Moments'
  },
  {
    id: 3,
    type: 'image',
    src: '/battlebots.jpg',
    alt: 'Team Workshop',
    title: 'Behind the Scenes'
  },
  {
    id: 4,
    type: 'image',
    src: '/battlebots.jpg',
    alt: 'Robot Design',
    title: 'Engineering Excellence'
  },
  {
    id: 5,
    type: 'video',
    thumbnail: '/battlebots.jpg',
    src: '/video2.mp4',
    alt: 'Championship Match',
    title: 'Final Battle'
  },
  {
    id: 6,
    type: 'image',
    src: '/battlebots.jpg',
    alt: 'Award Ceremony',
    title: 'Victory Moment'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function MediaGallery() {
 // const [selectedItem, setSelectedItem] = useState<number | null>(null)

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold font-orbitron text-center mb-12"
        >
          <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
            Media Gallery
          </span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mediaItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm"
            >
              <div className="aspect-[16/9] relative">
                <Image
                  src={item.type === 'video' ? item.thumbnail || '' : item.src || ''}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.type === 'video' ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-[#FF4500] text-gray-900 p-4 rounded-full"
                    >
                      <Play size={24} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-[#00CED1] text-gray-900 p-4 rounded-full"
                    >
                      <Expand size={24} />
                    </motion.button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold font-orbitron text-gray-900 mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm">
                  {item.type === 'video' ? (
                    <Play size={16} className="mr-2" />
                  ) : (
                    <Expand size={16} className="mr-2" />
                  )}
                  <span className="capitalize">{item.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

