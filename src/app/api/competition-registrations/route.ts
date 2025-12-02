import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Check existing registrations for a user/team
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const teamId = searchParams.get('teamId')

    // If no params provided, return empty (for new users)
    if (!email && !teamId) {
      return NextResponse.json({
        registrations: [],
        registeredCompetitions: [],
        totalRegistrations: 0
      })
    }

    // Build query based on provided params
    let query = supabase.from('competition_registrations').select('*')
    
    if (teamId) {
      query = query.eq('team_id', teamId)
    } else if (email) {
      query = query.eq('user_email', email)
    }

    const { data: registrations, error } = await query

    if (error) {
      console.error('Error fetching competition registrations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }

    // Get unique competitions that are paid/confirmed
    const registeredCompetitions = registrations
      ?.filter(r => r.payment_status === 'COMPLETED' || r.status === 'CONFIRMED')
      .map(r => r.competition) || []

    return NextResponse.json({
      registrations: registrations || [],
      registeredCompetitions,
      totalRegistrations: registrations?.length || 0
    })
  } catch (error) {
    console.error('Competition registrations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new competition registrations (after payment verification)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { teamId, userEmail, competitions, paymentId } = body

    if (!teamId || !userEmail || !competitions || !Array.isArray(competitions)) {
      return NextResponse.json(
        { error: 'Missing required fields: teamId, userEmail, competitions' },
        { status: 400 }
      )
    }

    // Insert registrations for each competition
    const registrationsToInsert = competitions.map((comp: {
      competition: string
      amount: number
      robotName?: string
      robotWeight?: number
      robotDimensions?: string
      weaponType?: string
    }) => ({
      team_id: teamId,
      user_email: userEmail,
      competition: comp.competition,
      amount: comp.amount,
      robot_name: comp.robotName,
      robot_weight: comp.robotWeight,
      robot_dimensions: comp.robotDimensions,
      weapon_type: comp.weaponType,
      payment_id: paymentId,
      payment_status: 'COMPLETED',
      payment_date: new Date().toISOString(),
      status: 'CONFIRMED'
    }))

    const { data, error } = await supabase
      .from('competition_registrations')
      .insert(registrationsToInsert)
      .select()

    if (error) {
      console.error('Error creating competition registrations:', error)
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'One or more competitions already registered' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create registrations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      registrations: data,
      message: `Successfully registered for ${competitions.length} competition(s)`
    })
  } catch (error) {
    console.error('Competition registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
