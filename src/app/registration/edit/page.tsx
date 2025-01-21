'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { EditTeamForm } from '@/components/EditTeamForm'

interface TeamDetails {
  teamName: string
  institution: string
  robotDetails: {
    name: string
    weight: number
    dimensions: string
    weaponType: string
  }
  members: {
    name: string
    email: string
    phone: string
    role: string
  }[]
}

export default function EditRegistration() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch('/api/team-details')
        if (response.ok) {
          const data = await response.json()
          setTeamDetails(data.team)
        }
      } catch (error) {
        console.error('Failed to fetch team details:', error)
        router.push('/registration/details')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchTeamDetails()
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/team-details/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/registration/details')
      }
    } catch (error) {
      console.error('Failed to update team:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          {teamDetails && (
            <EditTeamForm
              initialData={{
                teamName: teamDetails.teamName,
                institution: teamDetails.institution,
                robotName: teamDetails.robotDetails.name,
                robotWeight: teamDetails.robotDetails.weight,
                robotDimensions: teamDetails.robotDetails.dimensions,
                weaponType: teamDetails.robotDetails.weaponType,
                members: teamDetails.members
              }}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/registration/details')}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
} 