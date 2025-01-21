'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { SignInButton } from './SignInButton'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Event Details', href: '/event-details' },
  { name: 'Live Updates', href: '/live-updates' },
  { name: 'Media Gallery', href: '/media-gallery' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if user has registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/team-details')
          const data = await response.json()
          setHasRegistered(response.ok && data.team)
        } catch (error) {
          console.error('Failed to check registration status:', error)
          setHasRegistered(false)
        }
      }
    }

    if (status === 'authenticated') {
      checkRegistration()
    }
  }, [session, status])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-6`}
    >
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/40'
      }`}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold font-orbitron bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              RoboMania 2025
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="flex space-x-8"
            >
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-[#00CED1] transition-colors duration-200 font-orbitron"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* User Menu */}
            {status === 'authenticated' && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4500] to-[#00CED1] flex items-center justify-center">
                      {session.user.name?.[0] || session.user.email?.[0]}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-black/95 backdrop-blur-sm border border-white/10 shadow-lg py-1"
                    >
                      {hasRegistered ? (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-white hover:text-[#00CED1] hover:bg-white/5"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/team-register"
                          className="block px-4 py-2 text-sm text-white hover:text-[#00CED1] hover:bg-white/5"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Register Team
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:text-[#00CED1] hover:bg-white/5 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <SignInButton />
            )}
          </nav>

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
            className="md:hidden bg-black/95 backdrop-blur-sm mt-2 rounded-xl"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-orbitron text-white hover:text-[#00CED1] hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session?.user && (
                <>
                  {hasRegistered ? (
                    <Link
                      href="/registration/details"
                      className="block px-3 py-2 rounded-md text-base font-orbitron text-white hover:text-[#00CED1] hover:bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View Registration
                    </Link>
                  ) : (
                    <Link
                      href="/team-register"
                      className="block px-3 py-2 rounded-md text-base font-orbitron text-white hover:text-[#00CED1] hover:bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register for RoboMania
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-orbitron text-white hover:text-[#00CED1] hover:bg-white/5 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

