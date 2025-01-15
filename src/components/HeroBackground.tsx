'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function HeroBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isMounted) {
    return (
      <div className="fixed inset-0 -z-1 bg-black">
        <div className="absolute inset-0 opacity-30" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -z-1">
      {/* Base background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,69,0,0.1) 1px, transparent 2px),
            linear-gradient(to bottom, rgba(255,69,0,0.1) 1px, transparent 2px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated gradients */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(255,69,0,0.4) 0%, transparent 60%)',
            'radial-gradient(circle at 100% 100%, rgba(0,206,209,0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Mouse follow effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,69,0,0.3), transparent 50%)`,
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />
    </div>
  )
} 