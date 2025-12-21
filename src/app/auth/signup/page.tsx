'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { HeroBackground } from '@/components/HeroBackground'
import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import bcrypt from 'bcryptjs'

export default function SignupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState('')
  const [checkingRegistration, setCheckingRegistration] = useState(false)

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        setCheckingRegistration(true)
        try {
          const response = await fetch('/api/check-registration')
          const data = await response.json()
          
          if (data.registeredCompetitions && data.registeredCompetitions.length >= 3) {
            // User is fully registered, redirect to dashboard
            router.replace('/dashboard')
            return
          }
        } catch (err) {
          console.error('Failed to check registration:', err)
        }
        setCheckingRegistration(false)
        // Normal redirect to team-register
        router.replace('/team-register')
      }
    }
    
    checkAndRedirect()
  }, [status, session, router])

  const handleSignup = async (data: { email: string; password: string; name?: string }) => {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          password: hashedPassword
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create account')
      }

      router.push('/auth/login?message=Account created successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (status === 'loading' || checkingRegistration) {
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
          Create Account
        </h1>
        <p className="text-white/60 mb-8">
          Join RoboMania and start your journey
        </p>
        <AuthForm 
          mode="signup"
         // onSubmit={handleSignup}
          error={error}
        />
        <p className="mt-4 text-white/60">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#00CED1] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 