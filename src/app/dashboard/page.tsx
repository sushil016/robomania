'use client'

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface BotDetails {
  id: string
  bot_name: string
  weight: number
  dimensions: string
  weapon_type?: string
  is_weapon_bot: boolean
}

interface CompetitionRegistration {
  id: string
  competition_type: string
  amount: number
  payment_status: string
  registration_status: string
  payment_id?: string
  payment_date?: string
  bot_id?: string
  bots?: BotDetails
}

interface RegistrationData {
  hasRegistered: boolean
  teamId: string | null
  teamName: string | null
  teamLocked: boolean
  paymentStatus: string | null
  registrationStatus: string | null
  leaderName: string | null
  leaderEmail: string | null
  leaderPhone: string | null
  teamMembers: Array<{ name: string; email: string; phone: string; role: string }>
  registeredCompetitions: CompetitionRegistration[]
  savedBots: BotDetails[]
  totalCompetitions: number
}

const COMPETITIONS = {
  ROBOWARS: { name: 'RoboWars', price: 300 },
  ROBORACE: { name: 'RoboRace', price: 200 },
  ROBOSOCCER: { name: 'RoboSoccer', price: 200 }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState<string | null>(null) // Track which payment is being verified
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      const s = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (s && s.parentNode) {
        s.parentNode.removeChild(s)
      }
    }
  }, [])

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'pending') {
      setNotification({ type: 'info', message: 'Registration saved. Complete payment to confirm.' })
    } else if (status === 'success') {
      setNotification({ type: 'success', message: 'Payment successful! Registration confirmed.' })
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return
      try {
        const response = await fetch(`/api/check-registration?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setRegistrationData(data)
          console.log('Dashboard data:', data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchData()
    }
  }, [user])

  const handlePayment = async (competitionId: string, amount: number, gateway: 'razorpay' | 'phonepe' = 'razorpay') => {
    if (!registrationData?.teamId) return
    setProcessingPayment(true)
    
    try {
      if (gateway === 'phonepe') {
        // PhonePe payment flow
        const orderResponse = await fetch('/api/phonepe/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId: registrationData.teamId,
            amount,
            competitions: [competitionId],
            userEmail: user?.email
          })
        })

        if (!orderResponse.ok) throw new Error('Failed to create PhonePe order')
        const orderResult = await orderResponse.json()

        // Initiate PhonePe payment
        const paymentResponse = await fetch('/api/phonepe/initiate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantOrderId: orderResult.merchantOrderId,
            amount: orderResult.totalAmount,
            userEmail: user?.email,
            teamName: registrationData.teamName
          })
        })

        if (!paymentResponse.ok) throw new Error('Failed to initiate PhonePe payment')
        const paymentData = await paymentResponse.json()

        // Redirect to PhonePe payment page
        window.location.href = paymentData.redirectUrl
      } else {
        // Razorpay payment flow (existing)
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId: registrationData.teamId,
            amount,
            competitions: [{ competition: competitionId, amount }]
          })
        })
        
        if (!orderResponse.ok) throw new Error('Failed to create order')
        const orderResult = await orderResponse.json()
        
        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderResult.amount,
          currency: 'INR',
          name: 'RoboMania 2025',
          description: `${COMPETITIONS[competitionId as keyof typeof COMPETITIONS]?.name} Registration`,
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
                  teamId: registrationData.teamId
                })
              })
              if (verifyResponse.ok) {
                setNotification({ type: 'success', message: 'Payment successful!' })
                const refreshResponse = await fetch(`/api/check-registration?email=${encodeURIComponent(user?.email || '')}`)
                if (refreshResponse.ok) {
                  const data = await refreshResponse.json()
                  setRegistrationData(data)
                }
              } else {
                setNotification({ type: 'error', message: 'Payment verification failed.' })
              }
            } catch {
              setNotification({ type: 'error', message: 'Payment verification failed.' })
            }
          },
          prefill: { email: user?.email },
          theme: { color: '#000000' }
        })
        razorpay.open()
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to initiate payment.' })
    } finally {
      setProcessingPayment(false)
    }
  }

  // Verify PhonePe payment manually
  const verifyPhonePePayment = async (paymentId: string) => {
    setVerifyingPayment(paymentId)
    try {
      console.log('Verifying PhonePe payment:', paymentId)
      
      const response = await fetch('/api/phonepe/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantOrderId: paymentId,
          email: user?.email
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNotification({ 
          type: 'success', 
          message: `Payment verified successfully! Transaction ID: ${data.transactionId}` 
        })
        
        // Reload registration data
        if (user?.email) {
          const regResponse = await fetch(`/api/check-registration?email=${encodeURIComponent(user.email)}`)
          if (regResponse.ok) {
            const regData = await regResponse.json()
            setRegistrationData(regData)
          }
        }
      } else if (response.status === 202) {
        setNotification({ 
          type: 'info', 
          message: 'Payment is still pending. Please wait a moment and try again.' 
        })
      } else {
        setNotification({ 
          type: 'error', 
          message: data.message || 'Payment verification failed' 
        })
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      setNotification({ 
        type: 'error', 
        message: 'Failed to verify payment. Please try again.' 
      })
    } finally {
      setVerifyingPayment(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!registrationData?.hasRegistered) {
    router.push('/team-register')
    return null
  }

  const totalPaid = registrationData.registeredCompetitions?.filter(c => c.payment_status === 'COMPLETED').reduce((sum, c) => sum + c.amount, 0) || 0
  const totalPending = registrationData.registeredCompetitions?.filter(c => c.payment_status === 'PENDING').reduce((sum, c) => sum + c.amount, 0) || 0
  const completedCount = registrationData.registeredCompetitions?.filter(c => c.payment_status === 'COMPLETED').length || 0
  const pendingCount = registrationData.registeredCompetitions?.filter(c => c.payment_status === 'PENDING').length || 0

  return (
    <div className="min-h-screen bg-white text-black pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b-2 border-black pb-6">
          <h1 className="text-3xl font-bold mb-2">{registrationData.teamName}</h1>
          <p className="text-sm text-gray-600">Team Dashboard</p>
        </motion.div>

        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="mb-6 p-3 border-2 border-black bg-white text-sm">
              <div className="flex items-start justify-between">
                <p className="flex-1">{notification.message}</p>
                <button onClick={() => setNotification(null)} className="ml-4 text-xl leading-none">×</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.02 }} className="border-2 border-black p-4">
            <p className="text-xs uppercase tracking-wider mb-1 text-gray-600">Competitions</p>
            <p className="text-2xl font-bold">{registrationData.totalCompetitions || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02 }} className="border-2 border-black p-4">
            <p className="text-xs uppercase tracking-wider mb-1 text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02 }} className="border-2 border-black p-4">
            <p className="text-xs uppercase tracking-wider mb-1 text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02 }} className="border-2 border-black p-4 bg-black text-white">
            <p className="text-xs uppercase tracking-wider mb-1 text-gray-300">Total Paid</p>
            <p className="text-2xl font-bold">₹{totalPaid}</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold uppercase tracking-wider">Competitions</h2>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/team-register')} className="text-xs border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
                Add New
              </motion.button>
            </div>

            {registrationData.registeredCompetitions && registrationData.registeredCompetitions.length > 0 ? (
              <div className="space-y-3">
                {registrationData.registeredCompetitions.map((competition, index) => (
                  <motion.div key={competition.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} whileHover={{ x: 4 }} className="border-2 border-black p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{COMPETITIONS[competition.competition_type as keyof typeof COMPETITIONS]?.name || competition.competition_type}</h3>
                        <p className="text-xs text-gray-600 mt-1">₹{competition.amount}</p>
                        {competition.payment_id && competition.payment_id.startsWith('ROBOMANIA_') && (
                          <p className="text-xs text-gray-500 mt-1">Order: {competition.payment_id}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 border ${competition.payment_status === 'COMPLETED' ? 'border-black bg-black text-white' : 'border-black'}`}>
                          {competition.payment_status === 'COMPLETED' ? 'Paid' : 'Pending'}
                        </span>
                        {/* Verify PhonePe Payment Button */}
                        {competition.payment_status === 'PENDING' && 
                         competition.payment_id && 
                         competition.payment_id.startsWith('ROBOMANIA_') && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => verifyPhonePePayment(competition.payment_id!)}
                            disabled={verifyingPayment === competition.payment_id}
                            className="text-xs px-3 py-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {verifyingPayment === competition.payment_id ? 'Verifying...' : 'Verify Payment'}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Team Information for this Competition */}
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3">Team Information for {COMPETITIONS[competition.competition_type as keyof typeof COMPETITIONS]?.name}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        {/* Team Leader */}
                        <div className="border-l-2 border-black pl-3">
                          <p className="uppercase tracking-wider text-gray-600 mb-1">Team Leader</p>
                          <p className="font-semibold">{registrationData.leaderName || 'Not Available'}</p>
                          <p className="text-gray-600">{registrationData.leaderEmail || ''}</p>
                          <p className="text-gray-600">{registrationData.leaderPhone || ''}</p>
                        </div>
                        {/* Team Members */}
                        <div>
                          <p className="uppercase tracking-wider text-gray-600 mb-1">Team Members</p>
                          {registrationData.teamMembers && registrationData.teamMembers.length > 0 ? (
                            <div className="space-y-2">
                              {registrationData.teamMembers.map((member, idx) => (
                                <div key={idx} className="border-l border-gray-400 pl-2">
                                  <p className="font-semibold">{member.name}</p>
                                  <p className="text-gray-600">{member.email}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No additional members</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bot Information */}
                    {competition.bots ? (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Bot for this Competition</p>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                          <p className="text-sm font-bold mb-2">{competition.bots.bot_name}</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-gray-500 uppercase text-[10px]">Weight</p>
                              <p className="font-semibold">{competition.bots.weight}kg</p>
                            </div>
                            <div>
                              <p className="text-gray-500 uppercase text-[10px]">Dimensions</p>
                              <p className="font-semibold">{competition.bots.dimensions}</p>
                            </div>
                            {competition.bots.weapon_type && (
                              <div className="col-span-2">
                                <p className="text-gray-500 uppercase text-[10px]">Weapon Type</p>
                                <p className="font-semibold">{competition.bots.weapon_type}</p>
                              </div>
                            )}
                          </div>
                          {competition.bots.is_weapon_bot && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <span className="text-[10px] px-2 py-1 bg-black text-white uppercase tracking-wider">Weapon Bot</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Bot for this Competition</p>
                        <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded text-center">
                          <p className="text-xs text-gray-500">No bot assigned yet</p>
                          <p className="text-[10px] text-gray-400 mt-1">You'll need to assign a bot for this competition</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Gateway Options for Pending Payments */}
                    {competition.payment_status === 'PENDING' && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Choose Payment Method</p>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            onClick={() => handlePayment(competition.competition_type, competition.amount, 'razorpay')} 
                            disabled={processingPayment} 
                            className="py-2 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {processingPayment ? '...' : 'Razorpay'}
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            onClick={() => handlePayment(competition.competition_type, competition.amount, 'phonepe')} 
                            disabled={processingPayment} 
                            className="py-2 bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                          >
                            {processingPayment ? '...' : 'PhonePe'}
                          </motion.button>
                        </div>
                        <p className="text-center text-xs text-gray-500">₹{competition.amount}</p>
                      </div>
                    )}
                    {competition.payment_date && <p className="mt-2 text-xs text-gray-500">Paid: {new Date(competition.payment_date).toLocaleDateString()}</p>}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-2 border-dashed border-gray-400 p-8 text-center">
                <p className="text-sm text-gray-600 mb-4">No competitions registered yet</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/team-register')} className="border-2 border-black px-4 py-2 text-xs font-bold hover:bg-black hover:text-white transition-colors">
                  Register Now
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
            <div className="border-2 border-black p-4 bg-black text-white">
              <h3 className="text-xs uppercase tracking-wider mb-3 text-gray-300">Team Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-bold">{registrationData.teamName}</p>
                </div>
                {registrationData.teamLocked && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400">Status: Team Locked</p>
                  </div>
                )}
              </div>
            </div>

            {registrationData.savedBots && registrationData.savedBots.length > 0 && (
              <div className="border-2 border-black p-4">
                <h3 className="text-xs uppercase tracking-wider mb-3">Saved Bots ({registrationData.savedBots.length})</h3>
                <div className="space-y-2">
                  {registrationData.savedBots.map((bot, index) => (
                    <motion.div key={bot.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ x: 2 }} className="text-sm border border-gray-300 p-2">
                      <p className="font-bold text-xs">{bot.bot_name}</p>
                      <p className="text-xs text-gray-600">{bot.weight}kg • {bot.dimensions}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {totalPending > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="border-2 border-black p-4">
                <p className="text-xs uppercase tracking-wider mb-2">Action Required</p>
                <p className="text-sm font-bold mb-2">{pendingCount} Pending Payment{pendingCount > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-600">Total: ₹{totalPending}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
