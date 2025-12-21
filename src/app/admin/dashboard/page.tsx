'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, Users, DollarSign, Clock, Download, LogOut, RefreshCw, 
  CheckCircle, Mail, ChevronDown, ChevronUp, Search, Sword, Car, Goal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '../components/ExportButton'

interface Team {
  id: string
  team_name: string
  leader_name: string
  leader_email: string
  leader_phone: string
  institution: string
  created_at: string
  team_members: any[]
  competition_registrations: any[]
  bots: any[]
  totalRegistrations: number
  paidRegistrations: number
  pendingRegistrations: number
  competitions: string[]
  totalAmount: number
  paidAmount: number
}

interface Stats {
  totalTeams: number
  pendingTeams: number
  approvedTeams: number
  completedPayments: number
  pendingPayments: number
  totalRevenue: number
  totalContacts: number
  newsletterSubscribers: number
  competitions: {
    robowars: number
    roborace: number
    robosoccer: number
  }
}

const COMPETITION_COLORS: Record<string, string> = {
  'ROBOWARS': 'bg-red-500',
  'ROBORACE': 'bg-blue-500',
  'ROBOSOCCER': 'bg-green-500'
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<Stats>({
    totalTeams: 0,
    pendingTeams: 0,
    approvedTeams: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    totalContacts: 0,
    newsletterSubscribers: 0,
    competitions: { robowars: 0, roborace: 0, robosoccer: 0 }
  })
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCompetition, setFilterCompetition] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    
    try {
      const [teamsRes, statsRes] = await Promise.all([
        fetch('/api/admin/teams', { credentials: 'include' }),
        fetch('/api/admin/stats', { credentials: 'include' })
      ])

      if (teamsRes.ok && statsRes.ok) {
        const teamsData = await teamsRes.json()
        const statsData = await statsRes.json()
        
        setTeams(teamsData.teams || [])
        setFilteredTeams(teamsData.teams || [])
        setStats(statsData)
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user?.isAdmin) {
      signOut()
      return
    }

    fetchData()
  }, [session, status, fetchData])

  // Filter teams
  useEffect(() => {
    let result = [...teams]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(team => 
        team.team_name?.toLowerCase().includes(query) ||
        team.leader_name?.toLowerCase().includes(query) ||
        team.leader_email?.toLowerCase().includes(query) ||
        team.institution?.toLowerCase().includes(query)
      )
    }
    
    if (filterCompetition !== 'all') {
      result = result.filter(team => 
        team.competitions.includes(filterCompetition.toUpperCase())
      )
    }
    
    if (filterPayment === 'paid') {
      result = result.filter(team => team.paidRegistrations > 0)
    } else if (filterPayment === 'pending') {
      result = result.filter(team => team.pendingRegistrations > 0)
    }
    
    setFilteredTeams(result)
  }, [teams, searchQuery, filterCompetition, filterPayment])

  const handleSendReminder = async (teamId: string, email: string) => {
    setSendingReminder(teamId)
    try {
      const res = await fetch('/api/admin/send-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, email })
      })
      
      if (res.ok) {
        alert('Reminder sent successfully!')
      } else {
        alert('Failed to send reminder')
      }
    } catch (error) {
      alert('Error sending reminder')
    } finally {
      setSendingReminder(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
            >
              Admin Dashboard
            </motion.h1>
            <p className="text-gray-500 mt-1">Welcome, {session?.user?.name || session?.user?.email}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <ExportButton 
              data={teams} 
              filename="robomania-teams-export"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Export
            </ExportButton>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Teams</CardTitle>
                <Users className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTeams}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Paid</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.completedPayments}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                <Clock className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Competition Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-br from-red-500 to-orange-500 border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">RoboWars</CardTitle>
              <Sword className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.competitions?.robowars || 0}</div>
              <p className="text-sm text-white/70 mt-1">registrations</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">RoboRace</CardTitle>
              <Car className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.competitions?.roborace || 0}</div>
              <p className="text-sm text-white/70 mt-1">registrations</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">RoboSoccer</CardTitle>
              <Goal className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.competitions?.robosoccer || 0}</div>
              <p className="text-sm text-white/70 mt-1">registrations</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams, leaders, institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterCompetition}
                  onChange={(e) => setFilterCompetition(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                >
                  <option value="all">All Competitions</option>
                  <option value="robowars">RoboWars</option>
                  <option value="roborace">RoboRace</option>
                  <option value="robosoccer">RoboSoccer</option>
                </select>
                
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {filteredTeams.length} of {teams.length} teams</span>
            </div>
          </div>

          {/* Teams List */}
          <div className="divide-y divide-gray-100">
            {filteredTeams.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No teams found matching your criteria</p>
              </div>
            ) : (
              filteredTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Team Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {team.team_name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{team.team_name}</h3>
                          <p className="text-sm text-gray-500">{team.institution || 'No institution'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Competition badges */}
                        <div className="hidden md:flex gap-1">
                          {team.competitions?.map((comp: string) => (
                            <span
                              key={comp}
                              className={`px-2 py-1 text-xs font-medium text-white rounded ${COMPETITION_COLORS[comp] || 'bg-gray-500'}`}
                            >
                              {comp.replace('ROBO', '')}
                            </span>
                          ))}
                        </div>
                        
                        {/* Payment status */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{team.paidAmount || 0}</div>
                          <div className="text-xs text-gray-500">
                            {team.paidRegistrations || 0}/{team.totalRegistrations || 0} paid
                          </div>
                        </div>
                        
                        {expandedTeam === team.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedTeam === team.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50 border-t border-gray-100"
                      >
                        <div className="p-4 space-y-4">
                          {/* Leader Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wide">Leader</label>
                              <p className="font-medium text-gray-900">{team.leader_name}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                              <p className="font-medium text-gray-900">{team.leader_email}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wide">Phone</label>
                              <p className="font-medium text-gray-900">{team.leader_phone || 'N/A'}</p>
                            </div>
                          </div>
                          
                          {/* Team Members */}
                          {team.team_members && team.team_members.length > 0 && (
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wide">Team Members</label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {team.team_members.map((member: any, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                                    {member.name} ({member.role || 'Member'})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Competition Registrations - Detailed View */}
                          <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">Competition Registrations</label>
                            <div className="space-y-4">
                              {team.competition_registrations?.map((reg: any) => {
                                const compColor = COMPETITION_COLORS[reg.competition_type] || 'bg-gray-500'
                                const isPaid = reg.payment_status === 'COMPLETED'
                                const paymentDate = reg.payment_date ? new Date(reg.payment_date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : null
                                const createdDate = new Date(reg.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                                
                                // Get members for this competition
                                const compMembers = team.team_members?.filter((m: any) => 
                                  m.competition_type === reg.competition_type
                                ) || []
                                
                                // Get bot for this competition
                                const compBot = team.bots?.find((b: any) => 
                                  b.competition_type === reg.competition_type
                                )
                                
                                return (
                                  <div 
                                    key={reg.id} 
                                    className={`p-4 bg-white rounded-xl border-2 ${isPaid ? 'border-green-200' : 'border-orange-200'}`}
                                  >
                                    {/* Competition Header */}
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${compColor} rounded-lg flex items-center justify-center`}>
                                          {reg.competition_type === 'ROBOWARS' && <Sword className="w-5 h-5 text-white" />}
                                          {reg.competition_type === 'ROBORACE' && <Car className="w-5 h-5 text-white" />}
                                          {reg.competition_type === 'ROBOSOCCER' && <Goal className="w-5 h-5 text-white" />}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-gray-900">{reg.competition_type.replace('ROBO', 'Robo')}</h4>
                                          <p className="text-xs text-gray-500">Registered: {createdDate}</p>
                                        </div>
                                      </div>
                                      <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                                        isPaid 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        {isPaid ? '✓ Paid' : '⏳ Pending'}
                                      </span>
                                    </div>
                                    
                                    {/* Team Leader Info */}
                                    <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                                      <label className="text-xs text-orange-600 uppercase font-semibold mb-2 block">👑 Team Leader</label>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <div>
                                          <span className="text-gray-500">Name:</span>
                                          <span className="ml-2 font-semibold text-gray-900">{team.leader_name}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Email:</span>
                                          <span className="ml-2 font-medium text-gray-900">{team.leader_email}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Phone:</span>
                                          <span className="ml-2 font-medium text-gray-900">{team.leader_phone || 'N/A'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Team Members for this Competition */}
                                    {compMembers.length > 0 && (
                                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <label className="text-xs text-blue-600 uppercase font-semibold mb-2 block">👥 Team Members ({compMembers.length})</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {compMembers.map((member: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg">
                                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                                                {idx + 1}
                                              </div>
                                              <div>
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email || member.phone || member.role || 'Member'}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Bot Details for this Competition */}
                                    {compBot && (
                                      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <label className="text-xs text-purple-600 uppercase font-semibold mb-2 block">🤖 Robot Details</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                          <div className="bg-white p-2 rounded-lg">
                                            <span className="text-gray-500 text-xs block">Name</span>
                                            <span className="font-bold text-gray-900">{compBot.name || 'N/A'}</span>
                                          </div>
                                          <div className="bg-white p-2 rounded-lg">
                                            <span className="text-gray-500 text-xs block">Weight</span>
                                            <span className="font-semibold text-gray-900">{compBot.weight ? `${compBot.weight} kg` : 'N/A'}</span>
                                          </div>
                                          <div className="bg-white p-2 rounded-lg">
                                            <span className="text-gray-500 text-xs block">Dimensions</span>
                                            <span className="font-semibold text-gray-900">{compBot.dimensions || 'N/A'}</span>
                                          </div>
                                          {compBot.weapon_type && (
                                            <div className="bg-white p-2 rounded-lg">
                                              <span className="text-gray-500 text-xs block">Weapon</span>
                                              <span className="font-semibold text-gray-900">{compBot.weapon_type}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Payment Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="text-xs text-gray-500 uppercase">Amount</label>
                                        <p className="font-bold text-gray-900 text-lg">₹{reg.amount}</p>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="text-xs text-gray-500 uppercase">Order ID</label>
                                        <p className="font-mono text-gray-900 text-xs break-all">{reg.razorpay_order_id || reg.phonepe_order_id || 'N/A'}</p>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="text-xs text-gray-500 uppercase">Payment ID</label>
                                        <p className="font-mono text-gray-900 text-xs break-all">{reg.razorpay_payment_id || reg.phonepe_transaction_id || 'N/A'}</p>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="text-xs text-gray-500 uppercase">Paid On</label>
                                        <p className="font-medium text-gray-900">{paymentDate || 'Not yet paid'}</p>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                              
                              {(!team.competition_registrations || team.competition_registrations.length === 0) && (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <p className="text-gray-500">No competition registrations found</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            {team.pendingRegistrations > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSendReminder(team.id, team.leader_email)
                                }}
                                disabled={sendingReminder === team.id}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                              >
                                {sendingReminder === team.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Mail className="w-4 h-4" />
                                )}
                                Send Payment Reminder
                              </button>
                            )}
                            <a
                              href={`mailto:${team.leader_email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              <Mail className="w-4 h-4" />
                              Email Leader
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 