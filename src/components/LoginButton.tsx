'use client'

import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, update } = useSession()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const result = await signIn('google', {
        redirect: false,
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
        router.push('/auth/error')
      } else {
        // Wait for session to be updated
        await update()
        
        if (session?.user?.email) {
          const userResponse = await fetch(`/api/check-registration?email=${session.user.email}`)
          const userData = await userResponse.json()

          if (userResponse.ok && !userData.hasRegistered) {
            router.push('/')
          } else {
            router.push('/team-register')
          }
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      router.push('/auth/error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSignIn}
      className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium transition-colors ${
        loading ? 'bg-gray-400' : 'bg-white text-black hover:bg-white/90'
      }`}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </motion.button>
  )
} 