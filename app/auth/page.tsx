'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import LoginButton from '@/components/LoginButton'
import { HeroBackground } from '@/components/HeroBackground'

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
    <div className="min-h-screen flex items-center justify-center relative" >
      <HeroBackground />
      <div className="max-w-md mx-auto text-center flex flex-col items-center justify-center absolute inset-0 opacity-100">
        <h1 className="text-3xl mb-4 md:text-4xl font-bold font-orbitron bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#00CED1] bg-clip-text text-transparent">
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