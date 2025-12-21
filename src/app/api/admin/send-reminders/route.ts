import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPaymentReminderEmail } from '@/lib/email'
import { auth } from '@/auth'

/**
 * Admin endpoint to send payment reminder emails
 * Can be called manually or via a cron job
 * 
 * GET: Send reminders to all pending payments
 * POST: Send reminder to specific team
 */

export async function GET(request: Request) {
  try {
    // Verify admin access
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📧 Starting payment reminder job...')

    // Get all pending competition registrations with team info
    const { data: pendingRegistrations, error } = await supabaseAdmin
      .from('competition_registrations')
      .select(`
        id,
        competition_type,
        amount,
        created_at,
        team_id,
        teams:team_id (
          id,
          team_name,
          leader_name,
          user_email,
          contact_email
        )
      `)
      .eq('payment_status', 'PENDING')

    if (error) {
      console.error('Failed to fetch pending registrations:', error)
      return NextResponse.json({ error: 'Failed to fetch pending registrations' }, { status: 500 })
    }

    if (!pendingRegistrations || pendingRegistrations.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No pending payments found',
        sent: 0 
      })
    }

    console.log(`Found ${pendingRegistrations.length} pending registrations`)

    // Group registrations by team
    const teamRegistrations = new Map<string, {
      team: any,
      registrations: any[],
      totalAmount: number,
      competitions: string[]
    }>()

    for (const reg of pendingRegistrations) {
      const teamId = reg.team_id
      const team = reg.teams as any
      
      if (!team || !team.user_email && !team.contact_email) continue

      if (!teamRegistrations.has(teamId)) {
        teamRegistrations.set(teamId, {
          team,
          registrations: [],
          totalAmount: 0,
          competitions: []
        })
      }

      const teamData = teamRegistrations.get(teamId)!
      teamData.registrations.push(reg)
      teamData.totalAmount += reg.amount || 0
      teamData.competitions.push(reg.competition_type)
    }

    console.log(`Processing reminders for ${teamRegistrations.size} teams`)

    let sentCount = 0
    const results: { teamName: string; email: string; success: boolean }[] = []

    for (const [teamId, data] of teamRegistrations) {
      const { team, totalAmount, competitions, registrations } = data
      
      // Calculate days pending from oldest registration
      const oldestDate = new Date(Math.min(...registrations.map(r => new Date(r.created_at).getTime())))
      const daysPending = Math.floor((Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Only send reminders for payments pending more than 1 day
      if (daysPending < 1) continue

      const leaderEmail = team.user_email || team.contact_email

      try {
        await sendPaymentReminderEmail({
          teamName: team.team_name,
          leaderName: team.leader_name || 'Team Leader',
          leaderEmail: leaderEmail,
          competitions: competitions,
          totalAmount: totalAmount,
          daysPending: daysPending
        })

        sentCount++
        results.push({ teamName: team.team_name, email: leaderEmail, success: true })
        console.log(`✅ Reminder sent to ${team.team_name} (${leaderEmail})`)
      } catch (err) {
        console.error(`❌ Failed to send reminder to ${team.team_name}:`, err)
        results.push({ teamName: team.team_name, email: leaderEmail, success: false })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} reminder emails`,
      sent: sentCount,
      total: teamRegistrations.size,
      results
    })
  } catch (error) {
    console.error('Payment reminder job error:', error)
    return NextResponse.json({ 
      error: 'Failed to process reminders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin access
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId } = body

    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    // Get team info
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, leader_name, user_email, contact_email')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Get pending registrations for this team
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('competition_registrations')
      .select('*')
      .eq('team_id', teamId)
      .eq('payment_status', 'PENDING')

    if (regError || !registrations || registrations.length === 0) {
      return NextResponse.json({ error: 'No pending payments for this team' }, { status: 400 })
    }

    const totalAmount = registrations.reduce((sum, r) => sum + (r.amount || 0), 0)
    const competitions = registrations.map(r => r.competition_type)
    
    const oldestDate = new Date(Math.min(...registrations.map(r => new Date(r.created_at).getTime())))
    const daysPending = Math.floor((Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24))

    const leaderEmail = team.user_email || team.contact_email

    if (!leaderEmail) {
      return NextResponse.json({ error: 'No email address for team' }, { status: 400 })
    }

    await sendPaymentReminderEmail({
      teamName: team.team_name,
      leaderName: team.leader_name || 'Team Leader',
      leaderEmail: leaderEmail,
      competitions: competitions,
      totalAmount: totalAmount,
      daysPending: Math.max(daysPending, 1)
    })

    return NextResponse.json({
      success: true,
      message: `Reminder sent to ${team.team_name}`,
      email: leaderEmail,
      teamName: team.team_name,
      totalAmount,
      competitions
    })
  } catch (error) {
    console.error('Send reminder error:', error)
    return NextResponse.json({ 
      error: 'Failed to send reminder',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
