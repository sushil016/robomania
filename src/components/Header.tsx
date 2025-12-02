'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { SignInButton } from './SignInButton'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // const handleSignOut = async () => {
  //   await signOut({ callbackUrl: '/' })
  //   setIsMenuOpen(false)
  // }



  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-6`}
    >
      <div className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 ${
        isScrolled ? 'bg-white/10 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Left: IRL Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              {/* Replace with actual IRL logo once added to public folder */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4500] to-[#00CED1] flex items-center justify-center text-white font-bold">
                IRL
              </div>
            </Link>
          </motion.div>

          {/* Center: RoboMania Logo - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-[41%] transform -translate-x-1/2 hidden md:block"
          >
            <Link href="/" className="text-2xl font-bold font-orbitron bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent whitespace-nowrap">
              RoboMania 2025
            </Link>
          </motion.div>

          {/* Right: Sign Up Button (Desktop) */}
          <div className="hidden md:flex items-center">
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-white">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <SignInButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#00CED1] transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm mt-2 rounded-xl shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-2">
              {/* Mobile RoboMania Title */}
              <div className="text-center py-2 border-b border-gray-700">
                <span className="text-xl font-bold font-orbitron bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
                  RoboMania 2025
                </span>
              </div>

              {session?.user ? (
                <>
                  <div className="px-3 py-2 text-sm text-white">
                    {session.user.name || session.user.email}
                  </div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full px-3 py-2 rounded-md text-base font-orbitron text-white hover:text-[#00CED1] hover:bg-gray-800 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </>
              ) : (
                <div className="px-3 py-2">
                  <SignInButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

