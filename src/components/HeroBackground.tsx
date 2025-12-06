'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

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
      <div className="absolute inset-0 -z-10">
        <Image
          src="/Battlebots.png"
          alt="Battlebots Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10">
      {/* Background Image - more visible now */}
      <Image
        src="/Battlebots.png"
        alt="Battlebots Background"
        fill
        className="object-cover"
        priority
      />
      
      {/* Lighter gradient overlay for better image visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      {/* Subtle center spotlight effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/50" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,69,0,0.3) 1px, transparent 2px),
            linear-gradient(to bottom, rgba(255,69,0,0.3) 1px, transparent 2px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated gradients - more subtle */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(255,69,0,0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(0,206,209,0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Mouse follow effect - more subtle */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,69,0,0.3), transparent 40%)`,
        }}
      />

      {/* Strong vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
    </div>
  )
} 