import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!session) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${(session as any)?.accessToken || ''}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else if (response.status === 401) {
          router.push('/auth')
        } else {
          console.error('Failed to fetch user:', await response.text())
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, session])

  return { user, loading }
} 