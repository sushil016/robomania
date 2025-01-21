'use client'

import { useSearchParams } from 'next/navigation'
import { HeroBackground } from '@/components/HeroBackground'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <HeroBackground />
      <div className="max-w-md mx-auto text-center p-6 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-white/80">{error || 'Something went wrong'}</p>
      </div>
    </div>
  )
} 