import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    // Check both user_email and contact_email fields
    // Try with new columns first, fallback to basic fields if migration not run yet
    let query = supabaseAdmin
      .from('teams')
      .select('id, team_name, user_email, contact_email, payment_status, status, leader_name, leader_email, leader_phone')
      .or(`user_email.eq.${email},contact_email.eq.${email}`)
      .order('created_at', { ascending: false })

    let { data: teams, error } = await query

    // Try to get team_locked if column exists (after migration)
    let teamsWithLock: any[] = []
    if (teams && teams.length > 0 && !error) {
      const { data: teamsLock, error: lockError } = await supabaseAdmin
        .from('teams')
        .select('id, team_locked')
        .in('id', teams.map(t => t.id))
      
      if (!lockError && teamsLock) {
        // Merge the data
        teamsWithLock = teams.map(team => ({
          ...team,
          team_locked: teamsLock.find(t => t.id === team.id)?.team_locked || false
        }))
      } else {
        // Migration not run yet, use default
        teamsWithLock = teams.map(team => ({
          ...team,
          team_locked: false
        }))
      }
      teams = teamsWithLock
    }

    if (error) {
      console.error('Failed to check registration:', error)
      return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 })
    }

    const hasRegistered = teams && teams.length > 0
    const team = teams && teams.length > 0 ? teams[0] : null

    console.log('Check registration for:', email, 'Found:', hasRegistered, team)

    // If team exists, get their competition registrations
    let registeredCompetitions: any[] = []
    let savedBots: any[] = []

    if (team) {
      // Try to get competition registrations from new table
      const { data: competitions, error: competitionsError } = await supabaseAdmin
        .from('competition_registrations')
        .select(`
          id,
          competition_type,
          amount,
          payment_status,
          registration_status,
          payment_id,
          payment_date,
          bot_id,
          bots (
            id,
            bot_name,
            weight,
            dimensions,
            weapon_type,
            is_weapon_bot
          )
        `)
        .eq('team_id', team.id)
        .order('created_at', { ascending: true })

      console.log('Competition query result:', { competitions, competitionsError })

      // If new table doesn't exist or query fails, use old single-competition format from teams table
      if (competitionsError || !competitions || competitions.length === 0) {
        // Table doesn't exist or no data - use old format
        console.log('Using old single-competition format, error:', competitionsError?.code, competitionsError?.message)
        
        // Get the full team data with robot details
        const { data: fullTeam, error: teamError } = await supabaseAdmin
          .from('teams')
          .select('*')
          .eq('id', team.id)
          .single()

        console.log('Full team data:', fullTeam)
        console.log('Team error:', teamError)

        if (fullTeam) {
          const botData = (fullTeam as any).robot_name ? {
            id: null,
            bot_name: (fullTeam as any).robot_name,
            weight: (fullTeam as any).robot_weight,
            dimensions: (fullTeam as any).robot_dimensions,
            weapon_type: (fullTeam as any).weapon_type,
            is_weapon_bot: !!(fullTeam as any).weapon_type && (fullTeam as any).weapon_type !== ''
          } : null

          console.log('Bot data created:', botData)

          registeredCompetitions = [{
            id: fullTeam.id,
            competition_type: 'ROBORACE', // Default to RoboRace for old registrations
            amount: 200,
            payment_status: fullTeam.payment_status || 'PENDING',
            registration_status: fullTeam.status || 'PENDING',
            payment_id: fullTeam.payment_id,
            payment_date: fullTeam.payment_date,
            bot_id: null,
            bots: botData
          }]
          
          console.log('Registered competitions created:', registeredCompetitions)
        }
      } else {
        registeredCompetitions = competitions || []
        console.log('Using new format, competitions:', registeredCompetitions)
      }

      // Get user's saved bots (only works if migration run)
      const { data: bots } = await supabaseAdmin
        .from('bots')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false })

      savedBots = bots || []
    }

    // Get team members if team exists
    let teamMembers: any[] = []
    if (team) {
      const { data: members } = await supabaseAdmin
        .from('team_members')
        .select('name, email, phone, role')
        .eq('team_id', team.id)
        .order('created_at', { ascending: true })
      
      teamMembers = members || []
    }

    const responseData = {
      hasRegistered,
      teamId: team?.id || null,
      teamName: team?.team_name || null,
      teamLocked: (team as any)?.team_locked || false,
      paymentStatus: team?.payment_status || null,
      registrationStatus: team?.status || null,
      leaderName: (team as any)?.leader_name || null,
      leaderEmail: (team as any)?.leader_email || null,
      leaderPhone: (team as any)?.leader_phone || null,
      teamMembers,
      registeredCompetitions,
      savedBots,
      totalCompetitions: registeredCompetitions.length
    }

    console.log('=== FINAL API RESPONSE ===')
    console.log('Total competitions:', responseData.totalCompetitions)
    console.log('Registered competitions:', JSON.stringify(registeredCompetitions, null, 2))
    console.log('=========================')

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Failed to check registration:', error)
    return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 })
  }
}
