import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Simple API to fix a specific team's status
 * Usage: POST /api/admin/fix-single-team?teamId=YOUR_TEAM_ID
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    
    if (!teamId) {
      return NextResponse.json({ 
        error: 'teamId parameter is required',
        example: '/api/admin/fix-single-team?teamId=c21605a0-f561-4d3a-8652-7367317c3798'
      }, { status: 400 })
    }

    console.log('Fixing team:', teamId)

    // Get current team status
    const { data: currentTeam, error: fetchError } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (fetchError) {
      console.error('Failed to fetch team:', fetchError)
      return NextResponse.json({ 
        error: 'Failed to fetch team',
        details: fetchError.message,
        teamId: teamId
      }, { status: 500 })
    }

    if (!currentTeam) {
      return NextResponse.json({ 
        error: 'Team not found',
        teamId: teamId
      }, { status: 404 })
    }

    console.log('Current team:', {
      id: currentTeam.id,
      team_name: currentTeam.team_name,
      payment_status: currentTeam.payment_status,
      status: currentTeam.status
    })

    // Check if team needs fixing
    if (currentTeam.payment_status === 'COMPLETED' && currentTeam.status !== 'CONFIRMED') {
      console.log('Team needs fixing - updating status to CONFIRMED')
      
      const { data: updatedTeam, error: updateError } = await supabaseAdmin
        .from('teams')
        .update({ status: 'CONFIRMED' })
        .eq('id', teamId)
        .select()
        .single()

      if (updateError) {
        console.error('Failed to update team:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update team',
          details: updateError.message
        }, { status: 500 })
      }

      console.log('Team updated successfully:', updatedTeam)

      return NextResponse.json({
        success: true,
        message: 'Team status updated to CONFIRMED',
        before: {
          status: currentTeam.status,
          payment_status: currentTeam.payment_status
        },
        after: {
          status: updatedTeam.status,
          payment_status: updatedTeam.payment_status
        },
        team: updatedTeam
      })
    } else {
      console.log('Team does not need fixing')
      return NextResponse.json({
        success: true,
        message: 'Team status is already correct',
        team: {
          id: currentTeam.id,
          team_name: currentTeam.team_name,
          status: currentTeam.status,
          payment_status: currentTeam.payment_status
        }
      })
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Allow GET for easy browser access
export async function GET(request: Request) {
  return POST(request)
}
