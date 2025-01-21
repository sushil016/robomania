'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Edit, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { EditTeamForm } from '@/components/EditTeamForm'
import { Dialog } from '@headlessui/react'

interface TeamDetails {
  id: string
  teamName: string
  institution: string
  paymentStatus: 'PENDING' | 'COMPLETED'
  registrationStatus: string
  members: {
    name: string
    email: string
    phone: string
    role: string
  }[]
  robotDetails: {
    name: string
    weight: number
    dimensions: string
    weaponType: string
  }
}

export default function RegistrationDetails() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch('/api/team-details')
        if (response.ok) {
          const data = await response.json()
          setTeamDetails(data.team)
        } else {
          router.push('/team-register')
        }
      } catch (error) {
        console.error('Failed to fetch team details:', error)
        router.push('/team-register')
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

  const handlePayment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: teamDetails?.id,
          amount: 200 // Registration fee in INR
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { order } = await response.json()
      
      if (!order || !order.id || !order.amount) {
        throw new Error('Invalid order data received')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "Robowars Registration",
        description: "Team Registration Fee",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                teamId: teamDetails?.id
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            // Refresh team details to update status
            const updatedTeamResponse = await fetch('/api/team-details')
            if (!updatedTeamResponse.ok) {
              throw new Error('Failed to fetch updated team details')
            }
            const { team } = await updatedTeamResponse.json()
            setTeamDetails(team)
            toast.success('Payment completed successfully!')
          } catch (error) {
            console.error('Payment verification failed:', error)
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: teamDetails?.teamName,
          email: session?.user?.email,
        },
        theme: {
          color: "#00CED1"
        }
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment initiation failed:', error)
      toast.error('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch('/api/team-details/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setTeamDetails(data.team)
        setIsEditing(false)
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
      <div className="max-w-4xl mx-auto text-blue-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              Registration Details
            </h1>
            <div className="flex gap-4">
              <Link
                href="/registration/edit"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Details
              </Link>
              {teamDetails?.paymentStatus === 'PENDING' && (
                <button
                  onClick={handlePayment}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Registration Fee
                </button>
              )}
            </div>
          </div>

          {teamDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#00CED1]">Team Information</h2>
                  <div className="space-y-2">
                    <p><span className="text-white/60">Team Name:</span> {teamDetails.teamName}</p>
                    <p><span className="text-white/60">Institution:</span> {teamDetails.institution}</p>
                    <div className="space-y-2">
                      <p>
                        <span className="text-white/60">Registration Status:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
                          teamDetails.registrationStatus === 'PENDING' 
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {teamDetails.registrationStatus}
                        </span>
                      </p>
                      <p>
                        <span className="text-white/60">Payment Status:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
                          teamDetails.paymentStatus === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {teamDetails.paymentStatus === 'PENDING' ? 'Pending' : 'Completed'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#00CED1]">Robot Details</h2>
                  <div className="space-y-2">
                    <p><span className="text-white/60">Name:</span> {teamDetails.robotDetails.name}</p>
                    <p><span className="text-white/60">Weight:</span> {teamDetails.robotDetails.weight}kg</p>
                    <p><span className="text-white/60">Dimensions:</span> {teamDetails.robotDetails.dimensions}</p>
                    <p><span className="text-white/60">Weapon Type:</span> {teamDetails.robotDetails.weaponType}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#00CED1]">Team Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamDetails.members.map((member, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-white/60">{member.role}</p>
                      <p className="text-sm text-white/60">{member.email}</p>
                      <p className="text-sm text-white/60">{member.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 