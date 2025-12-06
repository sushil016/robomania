import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'
import { headers } from 'next/headers'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Helper function to get the base URL from request
async function getBaseUrl(): Promise<string> {
  // Priority: 1. NEXT_PUBLIC_APP_URL env var, 2. Request headers, 3. Default
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  const headersList = await headers()
  const host = headersList.get('host') || headersList.get('x-forwarded-host')
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  
  if (host) {
    // Use https for production domains
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    return `${isLocalhost ? 'http' : protocol}://${host}`
  }
  
  return 'http://localhost:3000'
}

interface CompetitionData {
  competition: string
  amount: number
  botId?: string | null
  robotName?: string
  robotWeight?: number
  robotDimensions?: string
  weaponType?: string
}

const COMPETITION_PRICES: Record<string, number> = {
  'robowars': 300,
  'ROBOWARS': 300,
  'roborace': 200,
  'ROBORACE': 200,
  'robosoccer': 200,
  'ROBOSOCCER': 200
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, teamId, competitions, userEmail, isNewTeam, teamData, robotDetails, paymentMethod } = body

    // Get the base URL from request headers
    const baseUrl = await getBaseUrl()
    console.log('📍 Base URL for API calls:', baseUrl)

    console.log('Create order request:', { 
      teamId, 
      userEmail: userEmail || teamData?.leaderEmail,
      isNewTeam, 
      competitionsCount: competitions?.length,
      competitions,
      hasTeamData: !!teamData
    })

    const finalUserEmail = userEmail || teamData?.leaderEmail || teamData?.contactEmail

    if (!competitions || !Array.isArray(competitions) || competitions.length === 0) {
      console.error('No competitions provided')
      return NextResponse.json({ error: 'At least one competition must be selected' }, { status: 400 })
    }

    let competitionsArray: CompetitionData[] = []
    
    if (typeof competitions[0] === 'string') {
      competitionsArray = competitions.map((comp: string) => ({
        competition: comp.toUpperCase(),
        amount: COMPETITION_PRICES[comp] || 200,
        robotName: robotDetails?.[comp]?.robotName,
        robotWeight: robotDetails?.[comp]?.weight,
        robotDimensions: robotDetails?.[comp]?.dimensions,
        weaponType: robotDetails?.[comp]?.weaponType
      }))
    } else {
      competitionsArray = competitions as CompetitionData[]
    }

    console.log('Processed competitions:', competitionsArray)

    let teamName = 'Team'
    let finalTeamId = teamId

    if (!teamId && teamData && finalUserEmail) {
      console.log('Creating new team:', teamData.teamName)
      
      const registerResponse = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamData,
          userEmail: finalUserEmail,
          contactEmail: teamData.leaderEmail,
          contactPhone: teamData.leaderPhone,
          robotName: robotDetails?.[competitions[0]]?.robotName || 'Bot',
          robotWeight: robotDetails?.[competitions[0]]?.weight || 5,
          robotDimensions: robotDetails?.[competitions[0]]?.dimensions || '30x30x30',
          weaponType: robotDetails?.[competitions[0]]?.weaponType || '',
          members: teamData.teamMembers || []
        })
      })

      const registerData = await registerResponse.json()
      
      if (!registerResponse.ok) {
        console.error('Failed to create team:', registerData)
        return NextResponse.json({ error: registerData.message || 'Failed to create team' }, { status: 400 })
      }

      finalTeamId = registerData.team?.id
      teamName = registerData.team?.teamName || teamData.teamName
      console.log('Team created successfully:', finalTeamId)
    }

    if (finalTeamId) {
      console.log('Fetching team with ID:', finalTeamId)
      const { data: team, error } = await supabaseAdmin.from('teams').select('*').eq('id', finalTeamId).single()

      if (error || !team) {
        console.error('Team fetch error:', error)
        return NextResponse.json({ error: `Team not found: \${error?.message || 'Team does not exist'}` }, { status: 404 })
      }

      console.log('Found team:', team.team_name)
      teamName = team.team_name
    } else if (finalUserEmail) {
      console.log('No teamId, searching by email:', finalUserEmail)
      const { data: teams, error } = await supabaseAdmin.from('teams').select('*').or(`user_email.eq.\${finalUserEmail},contact_email.eq.\${finalUserEmail}`).order('created_at', { ascending: false }).limit(1)

      if (error) {
        console.error('Error searching for team by email:', error)
      } else if (teams && teams.length > 0) {
        console.log('Found team by email:', teams[0].team_name)
        teamName = teams[0].team_name
        finalTeamId = teams[0].id
      }
    }

    if (!finalTeamId) {
      console.error('Could not determine team ID')
      return NextResponse.json({ error: 'Failed to create or find team. Please try again.' }, { status: 400 })
    }

    let totalAmount = 0
    if (competitionsArray && Array.isArray(competitionsArray)) {
      totalAmount = competitionsArray.reduce((sum: number, comp: CompetitionData) => {
        const competitionAmount = comp.amount || 0
        console.log(`Competition \${comp.competition}: ₹\${competitionAmount}`)
        return sum + competitionAmount
      }, 0)
    }

    if (totalAmount === 0 && amount) {
      totalAmount = amount
    }

    if (!totalAmount || totalAmount <= 0) {
      console.error('Invalid total amount:', totalAmount)
      return NextResponse.json({ error: 'Invalid payment amount. Total must be greater than 0.' }, { status: 400 })
    }

    console.log(`Total amount calculated: ₹\${totalAmount}`)

    const shortId = finalTeamId.slice(0, 8)
    const timestamp = Date.now().toString().slice(-8)
    const competitionNames = competitionsArray.map((c: CompetitionData) => c.competition).join(',')
    
    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `rcpt_\${shortId}_\${timestamp}`,
      notes: {
        teamId: finalTeamId,
        teamName: teamName,
        userEmail: finalUserEmail || '',
        competitions: competitionNames,
        competitionsCount: competitionsArray.length.toString(),
        isMultiCompetition: competitionsArray.length > 1 ? 'true' : 'false',
        totalAmount: totalAmount.toString()
      }
    }

    console.log('Creating Razorpay order...')
    const order = await razorpay.orders.create(options)
    console.log('✅ Razorpay order created:', order.id)

    if (finalTeamId && competitionsArray.length > 0) {
      console.log(`Saving \${competitionsArray.length} competition registrations...`)
      
      for (const comp of competitionsArray) {
        let botIdToUse = comp.botId || null

        // Create bot in database if robot details are provided and botId is not already set
        if (!botIdToUse && (comp.robotName || comp.robotWeight || comp.robotDimensions)) {
          console.log(`Creating bot for \${comp.competition}:`, comp.robotName)
          
          const { data: newBot, error: botError } = await supabaseAdmin
            .from('bots')
            .insert({
              team_id: finalTeamId,
              bot_name: comp.robotName || `Bot for \${comp.competition}`,
              weight: comp.robotWeight || 5,
              dimensions: comp.robotDimensions || '30x30x30',
              weapon_type: comp.weaponType || null,
              is_weapon_bot: !!(comp.weaponType && comp.weaponType.trim() !== '')
            })
            .select('id')
            .single()

          if (botError) {
            console.error(`❌ Failed to create bot for \${comp.competition}:`, botError)
          } else if (newBot) {
            botIdToUse = newBot.id
            console.log(`✅ Bot created with ID: \${botIdToUse}`)
          }
        }

        // Check for duplicate entries - ONLY for RoboWars with same bot
        const competitionType = comp.competition.toUpperCase()
        let shouldCreateNew = true

        if (competitionType === 'ROBOWARS' && botIdToUse) {
          // For RoboWars: check if same team + same bot already has an entry
          const { data: existingReg } = await supabaseAdmin
            .from('competition_registrations')
            .select('id')
            .eq('team_id', finalTeamId)
            .eq('competition_type', competitionType)
            .eq('bot_id', botIdToUse)
            .single()

          if (existingReg) {
            // Update existing RoboWars entry with same bot
            await supabaseAdmin
              .from('competition_registrations')
              .update({ 
                payment_id: order.id, 
                payment_status: 'PENDING', 
                amount: comp.amount 
              })
              .eq('id', existingReg.id)
            
            console.log(`✅ Updated existing RoboWars registration (same bot)`)
            shouldCreateNew = false
          }
        }
        // For RoboRace and RoboSoccer: ALWAYS create new entry (multiple entries allowed)
        
        if (shouldCreateNew) {
          await supabaseAdmin
            .from('competition_registrations')
            .insert({ 
              team_id: finalTeamId, 
              competition_type: competitionType, 
              bot_id: botIdToUse, 
              amount: comp.amount, 
              payment_id: order.id, 
              payment_status: 'PENDING', 
              registration_status: 'PENDING' 
            })
          
          console.log(`✅ Created new registration for ${comp.competition}${botIdToUse ? ` with bot ${botIdToUse}` : ''}`)
        }
      }
    }

    await supabaseAdmin.from('teams').update({ payment_id: order.id, is_multi_competition: competitionsArray.length > 1 }).eq('id', finalTeamId)

    console.log('✅ Order creation complete!')

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      totalAmount: totalAmount,
      teamId: finalTeamId,
      registrationId: finalTeamId,
      competitions: competitionNames
    })
  } catch (error) {
    console.error('❌ Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
