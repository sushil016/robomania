'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Users, Robot, Trophy, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface TeamDetails {
  id: string
  teamName: string
  institution: string
  robotName: string
  members: {
    name: string
    role: string
  }[]
  registrationStatus: string
  paymentStatus: string
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)
  const { user } = useAuth()
  const router = useRouter()

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
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTeamDetails()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!teamDetails) {
    router.push('/team-register')
    return null
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
            Team Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {teamDetails.teamName}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Registration Status"
            value={teamDetails.registrationStatus}
            icon={Users}
            color="from-green-500 to-emerald-500"
          />
          <StatusCard
            title="Payment Status"
            value={teamDetails.paymentStatus}
            icon={Trophy}
            color="from-blue-500 to-indigo-500"
          />
          <StatusCard
            title="Team Members"
            value={`${teamDetails.members.length} Members`}
            icon={Users}
            color="from-purple-500 to-pink-500"
          />
          <StatusCard
            title="Robot Status"
            value="In Development"
            icon={Robot}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Team Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamInfoCard team={teamDetails} />
          <RobotInfoCard team={teamDetails} />
        </div>
      </div>
    </div>
  )
}

function StatusCard({ title, value, icon: Icon, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-xl font-bold mt-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
    </motion.div>
  )
}

function TeamInfoCard({ team }: { team: TeamDetails }) {
  return (
    <div className="p-6 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10">
      <h2 className="text-xl font-bold mb-4">Team Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Team Name</p>
          <p className="text-white">{team.teamName}</p>
        </div>
        <div>
          <p className="text-gray-400">Institution</p>
          <p className="text-white">{team.institution}</p>
        </div>
        <div>
          <p className="text-gray-400">Team Members</p>
          <div className="space-y-2 mt-2">
            {team.members.map((member, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-white">{member.name}</p>
                <span className="text-sm text-gray-400">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RobotInfoCard({ team }: { team: TeamDetails }) {
  return (
    <div className="p-6 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10">
      <h2 className="text-xl font-bold mb-4">Robot Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Robot Name</p>
          <p className="text-white">{team.robotName}</p>
        </div>
        {/* Add more robot details here */}
      </div>
    </div>
  )
} 