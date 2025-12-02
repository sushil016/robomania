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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <Link
        href="/auth/login"
        className="relative px-4 py-3 bg-white rounded-full leading-none flex items-center space-x-2"
      >
        
        <span className="text-neutral-900 group-hover:text-gray-900 transition duration-200">
          Sign In
        </span>
      </Link>
    </motion.div>
  )
} 