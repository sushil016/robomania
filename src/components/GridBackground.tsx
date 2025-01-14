'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-deep-red via-vibrant-orange to-steel-blue opacity-30"
        animate={{
          background: [
            'radial-gradient(600px at 0% 0%, rgba(255, 69, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            'radial-gradient(600px at 100% 100%, rgba(0, 206, 209, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 69, 0, 0.15), transparent 80%)`,
        }}
      />
      
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  )
}

