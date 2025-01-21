'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader2, Github } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface LoginButtonProps {
  callbackUrl?: string
}

export default function LoginButton({ callbackUrl = '/team-register' }: LoginButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      await signIn('github', { callbackUrl })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#24292e] text-white rounded-lg hover:bg-[#2f363d] disabled:opacity-50 transition-colors"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Github className="w-5 h-5" />
          Continue with GitHub
        </>
      )}
    </motion.button>
  )
} 