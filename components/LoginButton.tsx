'use client'

import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function LoginButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => signIn('google', { callbackUrl: '/registration' })}
      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
    >
      {/* ... button content ... */}
    </motion.button>
  )
} 