'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '../components/ExportButton'
import { AnalyticsChart } from '../components/AnalyticsChart'

const columns = [
  { accessorKey: 'teamName', header: 'Team Name' },
  { accessorKey: 'institution', header: 'Institution' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'paymentStatus', header: 'Payment' },
]

export default function AdminDashboard() {
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  })
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, statsRes] = await Promise.all([
          fetch('/api/admin/teams'),
          fetch('/api/admin/stats')
        ])
        
        const teamsData = await teamsRes.json()
        const statsData = await statsRes.json()
        
        setTeams(teamsData)
        setStats(statsData)

        // Fetch analytics data
        const analyticsRes = await fetch('/api/admin/analytics')
        const analyticsData = await analyticsRes.json()
        setAnalyticsData(analyticsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10 mt-16 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <ExportButton 
            data={teams} 
            filename="robomania-teams-export" 
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalTeams}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingPayments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>

      {analyticsData && <AnalyticsChart data={analyticsData} />}

      <DataTable 
        data={teams} 
        columns={columns}
      />
    </div>
  )
} 