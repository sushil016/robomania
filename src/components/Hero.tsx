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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-theme-bg">
      <HeroBackground />
      
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-bold color-theme-text text-orange-300">
            <span className="text-theme-text">
              RoboMania 2025
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-theme-text-secondary">
            Gear Up for the Ultimate Robot Battle
          </p>
          
          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-theme-bg-card border border-theme-border flex flex-col items-center justify-center"
              >
                <span className="text-2xl sm:text-4xl font-bold text-theme-text">
                  {value}
                </span>
                <span className="text-xs sm:text-sm text-theme-text-muted capitalize">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={handleRegistrationClick}
              disabled={loading}
              className="px-8 py-4 bg-theme-accent hover:bg-theme-accent-hover border text-white rounded-xl font-medium transition-all duration-300 hover:shadow-glow flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  {status === 'authenticated' 
                    ? (hasRegistered ? 'View Registration' : 'Register Team') 
                    : 'Sign In & Register'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
            
            <Link
              href="/event-details"
              className="px-8 py-4 bg-theme-bg-card border border-theme-border hover:border-theme-accent text-theme-text rounded-xl font-medium transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

