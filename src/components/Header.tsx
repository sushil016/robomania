'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, Home, Calendar, Phone, Users, Award, User, ChevronDown, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { SignInButton } from './SignInButton'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'EVENTS', href: '/event-details', icon: Calendar },
  { name: 'CONTACT', href: '/contact', icon: Phone },
  { name: 'ABOUT US', href: '/about', icon: Users },
  { name: 'SPONSORS', href: '/sponsors', icon: Award },
]

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsDropdownOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 px-2 sm:px-4 lg:px-8 pt-4 sm:pt-6`}
    >
      <div className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-3xl shadow-2xl ' 
          : 'bg-white/10 backdrop-blur-3xl'
      }`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
          {/* Left: IRL Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/irl-logo.png"
                alt="IRL Logo"
                width={40}
                height={40}
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain"
              />
            </Link>
          </motion.div>

          {/* Center: RoboMania Logo - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-[40%] transform -translate-x-1/2 hidden md:block"
          >
            <Link href="/" className="text-xl lg:text-2xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_2px_10px_rgba(255,129,38,0.5)]">
              RoboMania 2025
            </Link>
          </motion.div>

          {/* Right: User Dropdown (Desktop) */}
          <div className="hidden md:flex items-center">
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-3" ref={dropdownRef}>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-[120px] truncate">
                      {session.user.name || session.user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/40 flex items-center gap-2 font-semibold"
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
              className="text-white hover:text-orange-400 transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
            className="md:hidden bg-white/10 backdrop-blur-3xl mt-2 rounded-xl shadow-2xl border border-white/20"
          >
            <div className="px-4 pt-2 pb-3 space-y-3">
              {/* Mobile RoboMania Title */}
              <div className="text-center py-2 border-b border-white/20">
                <span className="text-xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,129,38,0.5)]">
                  RoboMania 2025
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 py-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/20 group-hover:border-white/40 group-hover:bg-white/10 transition-all duration-300">
                        <item.icon 
                          className="w-4 h-4 transition-transform group-hover:scale-110" 
                          strokeWidth={2}
                          style={{ color: '#ff8126' }} 
                        />
                      </div>
                      <span className="font-medium text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {item.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* User Section */}
              <div className="border-t border-white/20 pt-3">
                {session?.user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-3 py-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="text-xs text-white/60 truncate">{session.user.email}</p>
                    </div>
                    
                    {/* Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/20">
                        <User className="w-4 h-4" style={{ color: '#ff8126' }} />
                      </div>
                      <span className="font-medium text-sm">Profile</span>
                    </Link>
                    
                    {/* Dashboard Button */}
                    <button
                      onClick={() => {
                        router.push('/dashboard')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-2.5 rounded-lg text-base font-orbitron text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-orange-500/40"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    
                    {/* Sign Out Button */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <SignInButton />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}