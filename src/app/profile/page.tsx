'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Loader2, User, Mail, Calendar, Trophy, CreditCard, 
  CheckCircle, Clock, ChevronRight, Shield, Bot 
} from 'lucide-react'
import Link from 'next/link'

interface CompetitionRegistration {
  id: string
  competition_type: string
  amount: number
  payment_status: string
  registration_status: string
  payment_date?: string
  created_at: string
}

interface ProfileData {
  hasRegistered: boolean
  teamId: string | null
  teamName: string | null
  leaderName: string | null
  leaderEmail: string | null
  leaderPhone: string | null
  institution?: string
  registeredCompetitions: CompetitionRegistration[]
  totalCompetitions: number
}

const COMPETITION_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  'ROBOWARS': { name: 'RoboWars', emoji: '⚔️', color: 'from-red-500 to-orange-500' },
  'ROBORACE': { name: 'RoboRace', emoji: '🏎️', color: 'from-blue-500 to-cyan-500' },
  'ROBOSOCCER': { name: 'RoboSoccer', emoji: '⚽', color: 'from-green-500 to-emerald-500' }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile')
      return
    }

    const fetchProfile = async () => {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/check-registration?email=${encodeURIComponent(session.user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchProfile()
    }
  }, [session, status, router])

  if (status === 'loading' || loading) {
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

  const totalPaid = profileData?.registeredCompetitions?.filter(c => c.payment_status === 'COMPLETED').reduce((sum, c) => sum + c.amount, 0) || 0
  const totalPending = profileData?.registeredCompetitions?.filter(c => c.payment_status === 'PENDING').reduce((sum, c) => sum + c.amount, 0) || 0

  return (
    <div className="min-h-screen bg-white py-8 px-4 relative overflow-hidden">
      {/* Diagonal Orange Beam Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-amber-50/30 to-transparent rotate-12 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-50/20 to-transparent -rotate-12 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-200/50">
              MY PROFILE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name || 'Champion'}!
          </h1>
          <p className="text-gray-500">Manage your account and view your registrations</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-200/50">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{session?.user?.name || 'User'}</h2>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {session?.user?.email}
                </p>
              </div>

              {profileData?.hasRegistered && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{profileData.totalCompetitions || 0}</p>
                    <p className="text-xs text-gray-500">Competitions</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">₹{totalPaid}</p>
                    <p className="text-xs text-gray-500">Paid</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-orange-600">₹{totalPending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{profileData.teamName?.charAt(0) || '-'}</p>
                    <p className="text-xs text-gray-500 truncate">{profileData.teamName || 'No Team'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Team Info */}
        {profileData?.hasRegistered && profileData.teamName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl shadow-xl shadow-orange-200/50 p-6 text-white mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Your Team</p>
                <h3 className="text-2xl font-bold">{profileData.teamName}</h3>
                {profileData.leaderName && (
                  <p className="text-orange-100 mt-1">Leader: {profileData.leaderName}</p>
                )}
              </div>
              <Link 
                href="/dashboard"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
              >
                View Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Registered Competitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Registered Competitions
            </h3>
            {profileData?.registeredCompetitions && profileData.registeredCompetitions.length < 3 && (
              <Link 
                href="/team-register"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Register More <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {profileData?.registeredCompetitions && profileData.registeredCompetitions.length > 0 ? (
            <div className="grid gap-4">
              {profileData.registeredCompetitions.length >= 3 && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">All Competitions Registered! 🎉</h4>
                      <p className="text-sm text-green-600">You&apos;ve registered for all available competitions</p>
                    </div>
                  </div>
                </div>
              )}
              {profileData.registeredCompetitions.map((comp, index) => {
                const info = COMPETITION_INFO[comp.competition_type] || { name: comp.competition_type, emoji: '🤖', color: 'from-gray-500 to-gray-600' }
                const isPaid = comp.payment_status === 'COMPLETED'
                
                return (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {info.emoji}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{info.name}</h4>
                        <p className="text-sm text-gray-500">₹{comp.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isPaid 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isPaid ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't registered for any competitions yet</p>
              <Link 
                href="/team-register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all"
              >
                Register Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Link 
            href="/dashboard"
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-xl transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Dashboard</h4>
              <p className="text-sm text-gray-500">Manage payments & bots</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>

          {profileData?.registeredCompetitions && profileData.registeredCompetitions.length >= 3 ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg shadow-green-200/30 p-5 border border-green-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">All Registered!</h4>
                <p className="text-sm text-green-600">You&apos;ve joined all competitions</p>
              </div>
            </div>
          ) : (
            <Link 
              href="/team-register"
              className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-xl transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Register</h4>
                <p className="text-sm text-gray-500">Join more competitions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
} 