'use client'

import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export function SignInButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <Link
        href="/auth/login"
        className="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center space-x-2"
      >
        <LogIn className="w-5 h-5" />
        <span className="text-white group-hover:text-white transition duration-200">
          Sign In
        </span>
      </Link>
    </motion.div>
  )
} 