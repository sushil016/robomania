'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { HeroBackground } from '@/components/HeroBackground'
import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/team-register'
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <HeroBackground />
      <div className="max-w-md mx-auto text-center flex flex-col items-center justify-center absolute inset-0 opacity-100 px-4">
        <h1 className="text-3xl mb-4 md:text-4xl font-bold font-orbitron bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#00CED1] bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-white/60 mb-8">
          Sign in to continue to RoboMania
        </p>
        <AuthForm 
          mode="login"
         // onSubmit={() => {}}
          error={error}
        />
        <p className="mt-4 text-white/60">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#00CED1] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 