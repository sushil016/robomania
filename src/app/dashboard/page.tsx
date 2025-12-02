'use client'

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Users, Bot, Trophy, Clock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
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

const COMPETITIONS = [
  { id: 'ROBOWARS', name: 'RoboWars', price: 300 },
  { id: 'ROBORACE', name: 'RoboRace', price: 200 },
  { id: 'ROBOSOCCER', name: 'RoboSoccer', price: 200 }
]

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Load Razorpay
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      const s = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (s) document.body.removeChild(s)
    }
  }, [])

  // Check URL params for status messages
  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'pending') {
      setNotification({ type: 'info', message: 'Your registration is saved! Complete payment to confirm your spot.' })
    } else if (status === 'success') {
      setNotification({ type: 'success', message: 'Payment successful! Your registration is confirmed.' })
    }
  }, [searchParams])

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

  const handleCompletePayment = async () => {
    if (!teamDetails) return
    setProcessingPayment(true)

    try {
      // Create order for default competition (RoboWars)
      const amount = 300 // Default amount
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: teamDetails.id,
          amount,
          competitions: [{ competition: 'ROBOWARS', amount: 300 }]
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const orderResult = await orderResponse.json()

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: 'INR',
        name: 'RoboMania 2025',
        description: 'Team Registration Payment',
        order_id: orderResult.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderResult.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                teamId: teamDetails.id
              })
            })
            if (verifyResponse.ok) {
              setNotification({ type: 'success', message: 'Payment successful! Your registration is confirmed.' })
              // Refresh team details
              const refreshResponse = await fetch('/api/team-details')
              if (refreshResponse.ok) {
                const data = await refreshResponse.json()
                setTeamDetails(data.team)
              }
            } else {
              setNotification({ type: 'error', message: 'Payment verification failed. Please contact support.' })
            }
          } catch {
            setNotification({ type: 'error', message: 'Payment verification failed. Please contact support.' })
          }
        },
        prefill: { email: user?.email },
        theme: { color: '#3b82f6' }
      })
      razorpay.open()
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to initiate payment. Please try again.' })
    } finally {
      setProcessingPayment(false)
    }
  }

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

  const isPendingPayment = teamDetails.paymentStatus === 'PENDING'

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Notification Banner */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
              notification.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
              'bg-blue-500/10 border border-blue-500/30 text-blue-400'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
             notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
             <Clock className="w-5 h-5" />}
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-auto text-sm opacity-70 hover:opacity-100">×</button>
          </motion.div>
        )}

        {/* Pending Payment Banner */}
        {isPendingPayment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <CreditCard className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400">Payment Pending</h3>
                  <p className="text-sm text-gray-400">Complete payment to confirm your registration for RoboMania 2025</p>
                </div>
              </div>
              <button
                onClick={handleCompletePayment}
                disabled={processingPayment}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {processingPayment ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>Complete Payment - ₹300</>
                )}
              </button>
            </div>
          </motion.div>
        )}

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
            icon={isPendingPayment ? Clock : Trophy}
            color={isPendingPayment ? "from-orange-500 to-yellow-500" : "from-blue-500 to-indigo-500"}
          />
          <StatusCard
            title="Team Members"
            value={`${teamDetails.members?.length || 0} Members`}
            icon={Users}
            color="from-purple-500 to-pink-500"
          />
          <StatusCard
            title="Robot Status"
            value="In Development"
            icon={Bot}
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
      className="p-6 bg-white/90 backdrop-blur-lg rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
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
    <div className="p-6 bg-white/90 backdrop-blur-lg rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Team Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Team Name</p>
          <p className="text-gray-900">{team.teamName}</p>
        </div>
        <div>
          <p className="text-gray-600">Institution</p>
          <p className="text-gray-900">{team.institution}</p>
        </div>
        <div>
          <p className="text-gray-600">Team Members</p>
          <div className="space-y-2 mt-2">
            {team.members.map((member, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-gray-900">{member.name}</p>
                <span className="text-sm text-gray-600">{member.role}</span>
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
    <div className="p-6 bg-white/90 backdrop-blur-lg rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Robot Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Robot Name</p>
          <p className="text-gray-900">{team.robotName}</p>
        </div>
        {/* Add more robot details here */}
      </div>
    </div>
  )
} 