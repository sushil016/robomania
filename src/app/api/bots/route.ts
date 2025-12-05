import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/bots
 * Fetch all bots for a user by email or team ID
 * 
 * Query params:
 *   - email: User's email address
 *   - teamId: Team ID (optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const teamId = searchParams.get('teamId')

    if (!email && !teamId) {
      return NextResponse.json({ 
        error: 'Either email or teamId is required' 
      }, { status: 400 })
    }

    let bots: any[] = []

    if (teamId) {
      // Fetch bots by team ID
      const { data, error } = await supabaseAdmin
        .from('bots')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bots by team ID:', error)
        return NextResponse.json({ 
          error: 'Failed to fetch bots',
          details: error.message 
        }, { status: 500 })
      }

      bots = data || []
    } else if (email) {
      // Fetch bots by user email
      const { data, error } = await supabaseAdmin
        .from('bots')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bots by email:', error)
        
        // If bots table doesn't exist, try to get robot data from teams table
        if (error.code === '42P01') {
          console.log('Bots table not found, fetching from teams table')
          
          const { data: teams, error: teamsError } = await supabaseAdmin
            .from('teams')
            .select('id, robot_name, robot_weight, robot_dimensions, weapon_type')
            .eq('user_email', email)

          if (teamsError) {
            return NextResponse.json({ 
              error: 'Failed to fetch bots',
              details: teamsError.message 
            }, { status: 500 })
          }

          // Convert teams data to bot format
          bots = (teams || [])
            .filter(team => (team as any).robot_name)
            .map(team => ({
              id: null,
              bot_name: (team as any).robot_name,
              weight: (team as any).robot_weight,
              dimensions: (team as any).robot_dimensions,
              weapon_type: (team as any).weapon_type,
              is_weapon_bot: !!(team as any).weapon_type && (team as any).weapon_type !== '',
              team_id: (team as any).id,
              user_email: email,
              created_at: null
            }))
        } else {
          return NextResponse.json({ 
            error: 'Failed to fetch bots',
            details: error.message 
          }, { status: 500 })
        }
      } else {
        bots = data || []
      }
    }

    console.log(`Found ${bots.length} bots for ${email || teamId}`)

    return NextResponse.json({
      success: true,
      count: bots.length,
      bots: bots
    })
  } catch (error) {
    console.error('Error in bots API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
