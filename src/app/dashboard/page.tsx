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

interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
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
  team_members?: TeamMember[]
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
          className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full"
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

  // Check if user can register for more competitions
  const allCompetitionTypes = ['ROBOWARS', 'ROBORACE', 'ROBOSOCCER']
  const registeredCompTypes = registrationData.registeredCompetitions?.map(c => c.competition_type) || []
  const canRegisterMore = allCompetitionTypes.some(type => !registeredCompTypes.includes(type))

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Diagonal Orange Beam Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-amber-50/30 to-transparent rotate-12 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-50/20 to-transparent -rotate-12 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[100px] bg-gradient-to-r from-orange-200/20 to-amber-200/20 rotate-45 blur-2xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 pb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              {registrationData.teamName?.charAt(0) || 'T'}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {registrationData.teamName}
              </h1>
              <p className="text-sm text-gray-500">Team Dashboard</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className={`mb-6 p-4 rounded-2xl text-sm shadow-lg ${
                notification.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : notification.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-orange-50 border border-orange-200 text-orange-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="flex-1">{notification.message}</p>
                <button onClick={() => setNotification(null)} className="ml-4 text-xl leading-none hover:opacity-70 transition-opacity">×</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100"
          >
            <p className="text-xs uppercase tracking-wider mb-1 text-gray-500">Competitions</p>
            <p className="text-3xl font-bold text-gray-900">{registrationData.totalCompetitions || 0}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100"
          >
            <p className="text-xs uppercase tracking-wider mb-1 text-green-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100"
          >
            <p className="text-xs uppercase tracking-wider mb-1 text-orange-500">Pending</p>
            <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-200/50 p-5 text-white"
          >
            <p className="text-xs uppercase tracking-wider mb-1 text-orange-100">Total Paid</p>
            <p className="text-3xl font-bold">₹{totalPaid}</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your Competitions</h2>
              {canRegisterMore && (
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => router.push('/team-register')} 
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all"
                >
                  + Add New
                </motion.button>
              )}
              {!canRegisterMore && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                  ✓ All Registered
                </span>
              )}
            </div>

            {registrationData.registeredCompetitions && registrationData.registeredCompetitions.length > 0 ? (
              <div className="space-y-4">
                {registrationData.registeredCompetitions.map((competition, index) => (
                  <motion.div 
                    key={competition.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 * index }} 
                    whileHover={{ y: -2 }} 
                    className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-900">{COMPETITIONS[competition.competition_type as keyof typeof COMPETITIONS]?.name || competition.competition_type}</h3>
                        <p className="text-sm text-gray-500 mt-1">₹{competition.amount}</p>
                        {competition.payment_id && competition.payment_id.startsWith('ROBOMANIA_') && (
                          <p className="text-xs text-gray-400 mt-1">Order: {competition.payment_id}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          competition.payment_status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {competition.payment_status === 'COMPLETED' ? '✓ Paid' : '⏳ Pending'}
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
                            className="text-xs px-3 py-1.5 rounded-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {verifyingPayment === competition.payment_id ? 'Verifying...' : 'Verify Payment'}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Team Information for this Competition */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">
                        Team for {COMPETITIONS[competition.competition_type as keyof typeof COMPETITIONS]?.name}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {/* Team Leader */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                          <p className="text-xs uppercase tracking-wider text-orange-600 font-semibold mb-1">Team Leader</p>
                          <p className="font-semibold text-gray-900">{registrationData.leaderName || 'Not Available'}</p>
                          <p className="text-gray-500 text-xs">{registrationData.leaderEmail || ''}</p>
                          <p className="text-gray-500 text-xs">{registrationData.leaderPhone || ''}</p>
                        </div>
                        {/* Team Members - use competition-specific members if available, otherwise fallback to team members */}
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Team Members</p>
                          {(() => {
                            const members = competition.team_members && competition.team_members.length > 0 
                              ? competition.team_members 
                              : registrationData.teamMembers
                            return members && members.length > 0 ? (
                              <div className="space-y-2">
                                {members.map((member, idx) => (
                                  <div key={idx} className="border-l-2 border-orange-300 pl-2">
                                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                                    <p className="text-gray-500 text-xs">{member.email}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No additional members</p>
                            )
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Bot Information */}
                    {competition.bots ? (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">🤖 Bot Details</p>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                          <p className="text-base font-bold text-gray-900 mb-3">{competition.bots.bot_name}</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Weight</p>
                              <p className="font-semibold text-gray-900">{competition.bots.weight}kg</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Dimensions</p>
                              <p className="font-semibold text-gray-900">{competition.bots.dimensions}</p>
                            </div>
                            {competition.bots.weapon_type && (
                              <div className="col-span-2">
                                <p className="text-gray-500 text-xs uppercase">Weapon Type</p>
                                <p className="font-semibold text-gray-900">{competition.bots.weapon_type}</p>
                              </div>
                            )}
                          </div>
                          {competition.bots.is_weapon_bot && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold">⚔️ Weapon Bot</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">🤖 Bot Details</p>
                        <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-xl text-center">
                          <p className="text-sm text-gray-500">No bot assigned yet</p>
                          <p className="text-xs text-gray-400 mt-1">You&apos;ll need to assign a bot for this competition</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Gateway Options for Pending Payments */}
                    {competition.payment_status === 'PENDING' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Choose Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            onClick={() => handlePayment(competition.competition_type, competition.amount, 'razorpay')} 
                            disabled={processingPayment} 
                            className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg"
                          >
                            {processingPayment ? '...' : '💳 Razorpay'}
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            onClick={() => handlePayment(competition.competition_type, competition.amount, 'phonepe')} 
                            disabled={processingPayment} 
                            className="py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
                          >
                            {processingPayment ? '...' : '📱 PhonePe'}
                          </motion.button>
                        </div>
                        <p className="text-center text-sm text-gray-500 font-medium">Amount: ₹{competition.amount}</p>
                      </div>
                    )}
                    {competition.payment_date && (
                      <p className="mt-3 text-xs text-gray-400">
                        ✓ Paid on {new Date(competition.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <p className="text-base text-gray-600 mb-4">No competitions registered yet</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => router.push('/team-register')} 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Register Now
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-200/50 p-5 text-white">
              <h3 className="text-xs uppercase tracking-wider mb-3 text-orange-100">Team Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-orange-200">Team Name</p>
                  <p className="font-bold text-lg">{registrationData.teamName}</p>
                </div>
                {registrationData.teamLocked && (
                  <div className="mt-3 pt-3 border-t border-orange-400/30">
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                      🔒 Team Locked
                    </span>
                  </div>
                )}
              </div>
            </div>

            {totalPending > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.8 }} 
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border-2 border-orange-200"
              >
                <p className="text-xs uppercase tracking-wider mb-2 text-orange-600 font-semibold">⚠️ Action Required</p>
                <p className="text-base font-bold text-gray-900 mb-1">{pendingCount} Pending Payment{pendingCount > 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-500">Total: <span className="font-bold text-orange-600">₹{totalPending}</span></p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
