'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the sign-in page after a few seconds
    const timer = setTimeout(() => {
      router.replace('/auth')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-lg text-gray-700">
          There was an error during the authentication process. Please try again.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          You will be redirected to the sign-in page shortly.
        </p>
      </div>
    </div>
  )
} 