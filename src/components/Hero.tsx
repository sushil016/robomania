'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroBackground } from './HeroBackground'

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const calculateTimeLeft = () => {
      const eventDate = new Date('2025-03-12T00:00:00').getTime()
      const now = new Date().getTime()
      const distance = eventDate - now

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString(),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString(),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString(),
        seconds: Math.floor((distance % (1000 * 60)) / 1000).toString(),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isMounted) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <HeroBackground />
      
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-orbitron"
          >
            <span className="bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#00CED1] bg-clip-text text-transparent">
              RoboMania 2025
            </span>
          </motion.h1>
          
          <motion.p
            variants={item}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-orbitron"
          >
            Gear Up for the Ultimate Robot Battle
          </motion.p>
          
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-8"
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#00CED1] p-[2px]"
              >
                <div className="w-full h-full rounded-lg bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl sm:text-4xl font-bold text-white">
                    {value}
                  </span>
                  <span className="text-sm sm:text-base text-white/70 capitalize">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/registration"
              className="relative inline-flex group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-vibrant-orange to-turquoise rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center">
                <span className="text-white group-hover:text-white transition duration-200">
                  Register Now
                </span>
              </button>
            </Link>
            
            <Link
              href="/event-details"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition duration-200"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

