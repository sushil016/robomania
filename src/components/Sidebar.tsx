'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Calendar, Phone, Users, Award, ShoppingCart } from 'lucide-react'

const navItems = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'EVENTS', href: '/events', icon: Calendar },
  { name: 'CONTACT', href: '/contact', icon: Phone },
  { name: 'ABOUT US', href: '/about', icon: Users },
  { name: 'SPONSORS', href: '/sponsors', icon: Award },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-4 top-1/4 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="bg-white/10 backdrop-blur-2xl rounded-full shadow-2xl p-3">
        {/* Navigation Items */}
        <nav className="flex flex-col items-center justify-center space-y-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="group relative flex flex-col items-center"
              >
                {/* Icon Container */}
                <div className="relative">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-[#00CED1] opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300 rounded-full" />
                  
                  {/* Icon with subtle background */}
                  <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/20 group-hover:border-[#00CED1] group-hover:bg-white/10 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Label - appears on hover */}
                <motion.span 
                  className="absolute left-14 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium pointer-events-none"
                  initial={false}
                >
                  {item.name}
                </motion.span>

                {/* Connecting line on hover */}
                <div className="absolute left-12 w-2 h-px bg-gradient-to-r from-[#FF4500] to-[#00CED1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Menu Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        <p className="text-white text-[10px] font-bold tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          MENU
        </p>
      </motion.div>
    </motion.aside>
  )
}
