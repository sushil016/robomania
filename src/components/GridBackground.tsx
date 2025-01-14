'use client'

import { motion } from 'framer-motion'

export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-deep-red via-vibrant-orange to-steel-blue opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  )
}

