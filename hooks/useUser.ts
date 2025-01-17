import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  team?: {
    id: string
    teamName: string
    status: string
    paymentStatus: string
  } | null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else if (response.status === 401) {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  return { user, loading }
} 