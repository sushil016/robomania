'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Providers({ 
  children,
  session = null
}: { 
  children: React.ReactNode,
  session?: any
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <SessionProvider session={session}>{children}</SessionProvider>
} 