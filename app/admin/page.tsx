'use client'

import { useState, useEffect } from 'react'

import { ExportButton } from './components/ExportButton'
import { AnalyticsChart } from './components/AnalyticsChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'

export default function AdminDashboard() {
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  })
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchDashboardData(),
      fetchAnalytics()
    ])
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [teamsRes, statsRes] = await Promise.all([
        fetch('/api/admin/teams'),
        fetch('/api/admin/stats')
      ])
      
      const teamsData = await teamsRes.json()
      const statsData = await statsRes.json()
      
      setTeams(teamsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchAnalytics = async () => {
    const res = await fetch('/api/admin/analytics')
    const data = await res.json()
    setAnalyticsData(data)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <ExportButton 
          data={teams} 
          filename="robomania-teams-export" 
        />
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

      {analyticsData && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <AnalyticsChart data={analyticsData} />
        </div>
      )}

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams">
          <DataTable 
            data={teams}
            columns={[
              { accessorKey: 'teamName', header: 'Team Name' },
              { accessorKey: 'institution', header: 'Institution' },
              { accessorKey: 'status', header: 'Status' },
              { accessorKey: 'paymentStatus', header: 'Payment' },
            ]}
          />
        </TabsContent>
        
        {/* Add other tabs content */}
      </Tabs>
    </div>
  )
} 