'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Loader2, Users, DollarSign, Clock, Download, LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'
import { ExportButton } from '../components/ExportButton'
import { AnalyticsChart } from '../components/AnalyticsChart'

const columns = [
  { accessorKey: 'teamName', header: 'Team Name' },
  { accessorKey: 'institution', header: 'Institution' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'paymentStatus', header: 'Payment' },
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  })
  const [analyticsData, setAnalyticsData] = useState({
    registrationTrends: []
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user?.isAdmin) {
      signOut()
      return
    }

    const fetchData = async () => {
      try {
        // First try to fetch teams only
        const teamsRes = await fetch('/api/admin/teams', {
          credentials: 'include',
        })
        console.log('Teams response status:', teamsRes.status)
        
        if (!teamsRes.ok) {
          const errorText = await teamsRes.text()
          console.error('Teams error:', errorText)
          throw new Error(`Failed to fetch teams: ${errorText}`)
        }

        const teamsData = await teamsRes.json()
        console.log('Teams data:', teamsData)
        
        // If teams fetch succeeds, fetch other data
        const [statsRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }),
          fetch('/api/admin/analytics', { credentials: 'include' })
        ])

        const [statsData, analyticsData] = await Promise.all([
          statsRes.json(),
          analyticsRes.json()
        ])

        setTeams(teamsData.teams || [])
        setStats(statsData)
        setAnalyticsData(analyticsData.data)
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, status])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent"
        >
          Dashboard Overview
        </motion.h1>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <ExportButton 
            data={teams} 
            filename="robomania-teams-export"
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-orange-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
          </ExportButton>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm md:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/70">
                Total Teams
              </CardTitle>
              <Users className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.totalTeams}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/70">
                Pending Payments
              </CardTitle>
              <Clock className="w-4 h-4 text-cyan-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.pendingPayments}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/70">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">₹{stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full overflow-hidden"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
          Analytics
        </h2>
        <div className="w-full min-h-[300px] md:min-h-[400px]">
          <AnalyticsChart data={analyticsData} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full overflow-x-auto"
      >
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="bg-black/30 border border-white/10 mb-2 flex-wrap">
            <TabsTrigger value="teams" className="data-[state=active]:bg-white/10 text-sm md:text-base">
              Teams
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-white/10 text-sm md:text-base">
              Payments
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/10 text-sm md:text-base">
              Contact Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-4">
            <div className="bg-black/30 backdrop-blur-lg rounded-lg p-3 md:p-6 border border-white/10 overflow-x-auto">
              <DataTable 
                data={teams}
                columns={columns}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
} 