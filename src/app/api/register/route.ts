import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sendRegistrationEmail } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase'

let resend: Resend | null = null

try {
  resend = new Resend(process.env.RESEND_API_KEY)
} catch (error) {
  console.error('Failed to initialize Resend:', error)
}

interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
}

interface RegistrationData {
  teamName: string
  institution: string
  contactEmail: string
  contactPhone: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  robotName: string
  robotWeight: string | number
  robotDimensions: string
  weaponType: string
  members: TeamMember[]
  userEmail: string
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json({ success: false, message: 'No data provided' }, { status: 400 })
    }

    const data = await request.json() as RegistrationData
    console.log('Received data:', data)

    if (!data.teamName || !data.institution || !data.members) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already has a team (by email)
    const { data: existingTeam, error: existingError } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('user_email', data.userEmail)
      .single()

    // If team exists for this user, DON'T update it - just return the existing team
    // Competition-specific data (bots, members per competition) will be handled separately
    if (existingTeam && !existingError) {
      console.log('Team already exists for user, returning existing team:', existingTeam.id)
      
      return NextResponse.json({
        success: true,
        message: 'Using existing team',
        team: { 
          id: existingTeam.id, 
          teamName: existingTeam.team_name, 
          status: existingTeam.status, 
          paymentStatus: existingTeam.payment_status 
        },
        isExisting: true
      })
    }

    // Check if user exists in profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', data.userEmail)
      .single()

    if (profileError || !profile) {
      console.log('Profile not found, creating one for:', data.userEmail)
      const { error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({ email: data.userEmail, name: data.leaderName || data.teamName })

      if (createProfileError) {
        console.error('Failed to create profile:', createProfileError)
      }
    }

    // Create team in database with DRAFT status (payment pending)
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        user_email: data.userEmail,
        team_name: data.teamName,
        institution: data.institution,
        leader_name: data.leaderName,
        leader_email: data.leaderEmail,
        leader_phone: data.leaderPhone,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        robot_name: data.robotName,
        robot_weight: data.robotWeight,
        robot_dimensions: data.robotDimensions,
        weapon_type: data.weaponType,
        status: 'PENDING',
        payment_status: 'PENDING'
      })
      .select()
      .single()

    if (teamError) {
      console.error('Database error:', teamError)
      return NextResponse.json({ success: false, message: 'Failed to register team', error: teamError.message }, { status: 500 })
    }

    // Insert team members into separate table
    if (data.members && data.members.length > 0) {
      const membersToInsert = data.members
        .filter(m => m.name && m.email) // Only insert valid members
        .map(member => ({
          team_id: team.id,
          name: member.name,
          email: member.email,
          phone: member.phone || '',
          role: member.role || 'Member'
        }))

      if (membersToInsert.length > 0) {
        const { error: membersError } = await supabaseAdmin
          .from('team_members')
          .insert(membersToInsert)

        if (membersError) {
          console.error('Failed to insert team members:', membersError)
          // Don't fail the whole registration, just log the error
        }
      }
    }

    // Send confirmation email
    try {
      if (resend && data.contactEmail) {
        await sendRegistrationEmail({
          teamName: data.teamName,
          leaderName: data.leaderName,
          leaderEmail: data.contactEmail
        })
        console.log('Registration email sent to:', data.contactEmail)
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Team registered successfully',
      team: { id: team.id, teamName: team.team_name, status: team.status }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
