import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email is required' 
      }, { status: 400 })
    }

    // Get team name for this user's email
    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('team_name')
      .eq('user_email', email)
      .single()

    if (error) {
      // User has no existing team
      console.log('No team found for email:', email)
      return NextResponse.json({ 
        success: true, 
        hasTeam: false,
        teamName: null 
      })
    }

    return NextResponse.json({ 
      success: true, 
      hasTeam: true,
      teamName: team.team_name 
    })

  } catch (error: any) {
    console.error('Error fetching team name:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch team name',
      error: error.message 
    }, { status: 500 })
  }
}
