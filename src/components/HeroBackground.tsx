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
          src="/homepage-background.png"
          alt="Homepage Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10">
      {/* Background Image */}
      <Image
        src="/homepage-background.png"
        alt="Homepage Background"
        fill
        className="object-cover"
        priority
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
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
            'radial-gradient(circle at 0% 0%, rgba(255,69,0,0.3) 0%, transparent 60%)',
            'radial-gradient(circle at 100% 100%, rgba(0,206,209,0.3) 0%, transparent 50%)',
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
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,69,0,0.2), transparent 50%)`,
        }}
      />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 opacity-50" />
    </div>
  )
} 