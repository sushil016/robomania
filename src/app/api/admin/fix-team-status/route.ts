import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * This API fixes teams that have COMPLETED payment but PENDING status
 * Run once to sync payment_status with team status
 */
export async function POST(request: Request) {
  try {
    // Add authentication check if needed
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    // Uncomment this to add basic protection
    // if (secret !== process.env.ADMIN_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log('Starting migration: Fixing teams with COMPLETED payment but PENDING status...')

    // First, let's see what teams we have
    const { data: allTeams, error: allError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, user_email, payment_status, status')

    if (allError) {
      console.error('Failed to fetch all teams:', allError)
      return NextResponse.json({ 
        error: 'Failed to fetch teams', 
        details: allError.message,
        code: allError.code 
      }, { status: 500 })
    }

    console.log(`Found ${allTeams?.length || 0} total teams`)
    console.log('All teams:', JSON.stringify(allTeams, null, 2))

    // Filter teams that need fixing
    const teamsToFix = allTeams?.filter(team => 
      team.payment_status === 'COMPLETED' && team.status !== 'CONFIRMED'
    ) || []

    if (teamsToFix.length === 0) {
      console.log('No teams need fixing')
      return NextResponse.json({ 
        success: true, 
        message: 'No teams need fixing',
        count: 0,
        totalTeams: allTeams?.length || 0,
        allTeams: allTeams
      })
    }

    console.log(`Found ${teamsToFix.length} teams to fix:`, teamsToFix)

    // Update all teams to CONFIRMED status
    const teamIds = teamsToFix.map(t => t.id)
    
    console.log('Updating team IDs:', teamIds)
    
    const { data: updatedTeams, error: updateError } = await supabaseAdmin
      .from('teams')
      .update({ status: 'CONFIRMED' })
      .in('id', teamIds)
      .select()

    if (updateError) {
      console.error('Failed to update teams:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update teams',
        details: updateError.message,
        code: updateError.code,
        teamIds: teamIds
      }, { status: 500 })
    }

    console.log('Successfully updated teams:', updatedTeams)

    return NextResponse.json({
      success: true,
      message: `Fixed ${updatedTeams?.length || 0} teams`,
      count: updatedTeams?.length || 0,
      teams: updatedTeams
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// Allow GET for easy browser access
export async function GET(request: Request) {
  return POST(request)
}
