'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroBackground } from './HeroBackground'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

export default function Hero() {
  const { data: session, status } = useSession()
  
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-02-20T00:00:00').getTime()
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

  useEffect(() => {
    const checkRegistration = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/team-details')
          const data = await response.json()
          setHasRegistered(response.ok && data.team)
        } catch (error) {
          console.error('Failed to check registration:', error)
          setHasRegistered(false)
        }
      }
    }

    if (status === 'authenticated') {
      checkRegistration()
    }
  }, [session, status])

  const handleRegistrationClick = async () => {
    setLoading(true)
    try {
      if (status === 'authenticated') {
        // Check if user has already registered
        const response = await fetch('/api/team-details')
        if (response.ok) {
          router.push('/dashboard')
        } else {
          router.push('/team-register')
        }
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
      </div>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-theme-bg w-full">
      <HeroBackground />
      
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 w-full"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold px-4 break-words">
            <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,100,0,0.8)] filter brightness-125">
              RoboMania 2025
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] px-4 break-words">
            Gear Up for the Ultimate Robot Battle
          </p>
          
          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 px-4 w-full">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div
                key={unit}
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl backdrop-blur-xl border border-orange-500/20 hover:border-white/40 transition-all duration-300 flex flex-col items-center justify-center shadow-xl flex-shrink-0"
              >
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {value}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm text-zinc-300 capitalize font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {unit}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4 px-4 w-full">
            <button
              onClick={handleRegistrationClick}
              disabled={loading}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-orange-500/70 backdrop-blur-xl hover:bg-orange-500/70 text-zinc-200 rounded-full font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/70 flex items-center border border-orange-400/30 flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin flex-shrink-0" />
                  <span className="whitespace-nowrap">Loading...</span>
                </>
              ) : (
                <>
                  <span className="whitespace-nowrap">
                    {status === 'authenticated' 
                      ? (hasRegistered ? 'View Registration' : 'Register Team') 
                      : 'Sign In & Register'}
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
                </>
              )}
            </button>
            
            <Link
              href="/event-details"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white/10 backdrop-blur-3xl border border-white/20 hover:border-white/40 text-white rounded-full font-bold transition-all duration-300 shadow-2xl hover:scale-105 whitespace-nowrap flex-shrink-0"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

