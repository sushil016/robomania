import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendStatusUpdateEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamIds, status, message } = await request.json()

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json(
        { error: 'Team IDs required' },
        { status: 400 }
      )
    }

    // Fetch teams
    const { data: teams, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .in('id', teamIds)

    if (error || !teams) {
      console.error('Teams fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      )
    }

    // Send emails to all teams
    const emailPromises = teams.map(team =>
      sendStatusUpdateEmail({
        teamName: team.team_name,
        leaderName: team.leader_name,
        leaderEmail: team.leader_email,
        status: status || 'Update',
        message: message || 'You have a new update regarding your registration.'
      })
    )

    await Promise.allSettled(emailPromises)

    return NextResponse.json({
      success: true,
      message: `Updates sent to ${teams.length} team(s)`
    })
  } catch (error) {
    console.error('Send update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
