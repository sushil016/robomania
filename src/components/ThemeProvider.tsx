"use client"

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash while loading
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider 
      {...props}
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  )
}
