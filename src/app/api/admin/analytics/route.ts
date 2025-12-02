import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get registration trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentTeams, error: teamsError } = await supabaseAdmin
      .from('teams')
      .select('created_at, status, payment_status')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (teamsError) {
      console.error('Analytics fetch error:', teamsError)
    }

    // Group by date
    const registrationTrends = (recentTeams || []).reduce((acc: any, team: any) => {
      const date = new Date(team.created_at).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = { date, count: 0 }
      }
      acc[date].count++
      return acc
    }, {})

    // Get status distribution
    const { data: statusData } = await supabaseAdmin
      .from('teams')
      .select('status')

    const statusDistribution = (statusData || []).reduce((acc: any, team: any) => {
      acc[team.status] = (acc[team.status] || 0) + 1
      return acc
    }, {})

    // Get payment distribution
    const { data: paymentData } = await supabaseAdmin
      .from('teams')
      .select('payment_status')

    const paymentDistribution = (paymentData || []).reduce((acc: any, team: any) => {
      acc[team.payment_status] = (acc[team.payment_status] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      analytics: {
        registrationTrends: Object.values(registrationTrends),
        statusDistribution,
        paymentDistribution
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
