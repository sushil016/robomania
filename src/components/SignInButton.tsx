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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
      <Link
        href="/auth/login"
        className="relative px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full leading-none flex items-center space-x-2 font-semibold shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300"
      >
        <LogIn className="w-4 h-4 text-white" />
        <span className="text-white">
          Sign In
        </span>
      </Link>
    </motion.div>
  )
} 