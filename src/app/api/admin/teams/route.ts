import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all teams with members, competition registrations, and bots
    const { data: teams, error } = await supabaseAdmin
      .from('teams')
      .select(`
        *,
        team_members (*),
        competition_registrations (*),
        bots (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Teams fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      )
    }

    // Transform the data to include computed fields
    const transformedTeams = teams?.map(team => ({
      ...team,
      totalRegistrations: team.competition_registrations?.length || 0,
      paidRegistrations: team.competition_registrations?.filter((r: any) => r.payment_status === 'COMPLETED').length || 0,
      pendingRegistrations: team.competition_registrations?.filter((r: any) => r.payment_status === 'PENDING').length || 0,
      competitions: team.competition_registrations?.map((r: any) => r.competition_type) || [],
      totalAmount: team.competition_registrations?.reduce((sum: number, r: any) => sum + (r.amount || 0), 0) || 0,
      paidAmount: team.competition_registrations?.filter((r: any) => r.payment_status === 'COMPLETED')
        .reduce((sum: number, r: any) => sum + (r.amount || 0), 0) || 0
    })) || []

    return NextResponse.json({
      success: true,
      teams: transformedTeams
    })
  } catch (error) {
    console.error('Teams API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId, status, paymentStatus } = await request.json()

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (status) updates.status = status
    if (paymentStatus) updates.payment_status = paymentStatus

    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single()

    if (error) {
      console.error('Team update error:', error)
      return NextResponse.json(
        { error: 'Failed to update team' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      team
    })
  } catch (error) {
    console.error('Team update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
