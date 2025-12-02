import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const { teamId, ...teamUpdates } = updates

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 })
    }

    // Verify team belongs to user
    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('user_email')
      .eq('id', teamId)
      .single()

    if (!team || team.user_email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update team
    const { data: updatedTeam, error } = await supabaseAdmin
      .from('teams')
      .update(teamUpdates)
      .eq('id', teamId)
      .select('*, team_members(*)')
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
      team: updatedTeam
    })
  } catch (error) {
    console.error('Team update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
