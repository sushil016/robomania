'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import LoginButton from '@/components/LoginButton'

export default function Auth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && session && status === 'authenticated') {
      router.replace('/')
    }
  }, [session, status, router, mounted])

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen py-36 px-4" suppressHydrationWarning>
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold font-orbitron mb-6 bg-gradient-to-r from-vibrant-orange to-turquoise bg-clip-text text-transparent">
          Sign in to Continue
        </h1>
        <p className="text-white/60 mb-8">
          Please sign in with Google to access all features
        </p>
        <LoginButton />
      </div>
    </div>
  )
} 