import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    console.log('Session:', session?.user?.email)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch team with members using Supabase
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select(`
        *,
        team_members (*)
      `)
      .eq('user_email', session.user.email)
      .single()

    if (teamError) {
      if (teamError.code === 'PGRST116') {
        console.log('No team found for email:', session.user.email)
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }
      console.error('Team fetch error:', teamError)
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
    }

    console.log('Found team:', team)

    if (!team) {
      console.log('No team found for email:', session.user.email)
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Transform to match frontend interface
    const transformedTeam = {
      id: team.id,
      teamName: team.team_name,
      institution: team.institution,
      paymentStatus: team.payment_status.toString(),
      registrationStatus: team.status.toString(),
      contactDetails: {
        email: team.contact_email,
        phone: team.contact_phone
      },
      leader: {
        name: team.leader_name,
        email: team.leader_email,
        phone: team.leader_phone
      },
      members: team.team_members || [],
      robotDetails: {
        name: team.robot_name,
        weight: team.robot_weight,
        dimensions: team.robot_dimensions,
        weaponType: team.weapon_type
      }
    }

    return NextResponse.json({ team: transformedTeam })
  } catch (error) {
    console.error('Team details fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
