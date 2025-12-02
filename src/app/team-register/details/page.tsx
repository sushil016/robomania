'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface TeamDetails {
  teamName: string
  institution: string
  status: string
  paymentStatus: string
  // Add other fields you want to display
}

export default function RegistrationDetails() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/team-details?email=${session.user.email}`)
          if (response.ok) {
            const data = await response.json()
            setTeamDetails(data.team)
          }
        } catch (error) {
          console.error('Failed to fetch team details:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (status === 'unauthenticated') {
      router.replace('/auth')
    } else if (status === 'authenticated') {
      fetchTeamDetails()
    }
  }, [session, status, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
          Registration Details
        </h1>
        
        {teamDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-[#00CED1] mb-2">Team Information</h2>
                <div className="space-y-2">
                  <p><span className="text-white/60">Team Name:</span> {teamDetails.teamName}</p>
                  <p><span className="text-white/60">Institution:</span> {teamDetails.institution}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#00CED1] mb-2">Status</h2>
                <div className="space-y-2">
                  <p><span className="text-white/60">Registration Status:</span> {teamDetails.status}</p>
                  <p><span className="text-white/60">Payment Status:</span> {teamDetails.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 