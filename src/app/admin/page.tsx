'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.isAdmin) {
      router.push('/')
      return
    }
    setLoading(false)
  }, [status, session, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to Admin Portal
        </h1>
        <p className="text-neutral-400 text-lg">
          Manage teams, track registrations, and monitor event progress
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push('/admin/dashboard')}
        className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0" />
        <LayoutDashboard className="w-5 h-5" />
        <span className="font-semibold">Go to Dashboard</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-500 text-sm"
      >
        Logged in as {session.user.email}
      </motion.div>
    </div>
  )
} 