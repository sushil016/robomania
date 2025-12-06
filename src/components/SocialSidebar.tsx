'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react'

const socialItems = [
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: '#1DA1F2' },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram, color: '#E4405F' },
  { name: 'YouTube', href: 'https://youtube.com', icon: Youtube, color: '#FF0000' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin, color: '#0A66C2' },
  { name: 'Email', href: 'mailto:teamrobonauts211@gmail.com', icon: Mail, color: '#00CED1' },
]

export default function SocialSidebar() {
  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed right-4 top-1/4 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="bg-white/10 backdrop-blur-3xl rounded-full shadow-2xl p-3">
        {/* Navigation Items */}
        <nav className="flex flex-col items-center justify-center space-y-4 ">
          {socialItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center"
                title={item.name}
              >
                {/* Icon Container */}
                <div className="relative">
                  {/* Background glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300  rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  
                  {/* Icon with subtle background */}
                  <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/20 group-hover:border-white/40 group-hover:bg-white/10 transition-all duration-300">
                    <item.icon 
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
                      strokeWidth={2}
                      style={{ color: '#ff8126' }}
                    />
                  </div>
                </div>

                {/* Label - appears on hover */}
                <motion.span 
                  className="absolute right-14 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium pointer-events-none"
                  initial={false}
                >
                  {item.name}
                </motion.span>

                {/* Connecting line on hover */}
                <div className="absolute right-12 w-2 h-px bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Follow Us Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center"
      >
        <p className="text-white text-[10px] font-bold tracking-widest rotate-0 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
         Follow
        </p>
      </motion.div>
    </motion.aside>
  )
}
