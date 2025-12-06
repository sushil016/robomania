import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import phonepeClient from '@/lib/phonepe'
import { CreateSdkOrderRequest } from 'pg-sdk-node'
import { v4 as uuid } from 'uuid'
import { headers } from 'next/headers'

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
    const { amount, teamId, competitions, userEmail, isNewTeam, teamData, robotDetails } = body

    // Get the base URL from request headers
    const baseUrl = await getBaseUrl()
    console.log('📍 Base URL for callbacks:', baseUrl)

    console.log('PhonePe create order request:', { 
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

    // Create new team if needed
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

    // Fetch team information
    if (finalTeamId) {
      console.log('Fetching team with ID:', finalTeamId)
      const { data: team, error } = await supabaseAdmin.from('teams').select('*').eq('id', finalTeamId).single()

      if (error || !team) {
        console.error('Team fetch error:', error)
        return NextResponse.json({ error: `Team not found: ${error?.message || 'Team does not exist'}` }, { status: 404 })
      }

      console.log('Found team:', team.team_name)
      teamName = team.team_name
    } else if (finalUserEmail) {
      console.log('No teamId, searching by email:', finalUserEmail)
      const { data: teams, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .or(`user_email.eq.${finalUserEmail},contact_email.eq.${finalUserEmail}`)
        .order('created_at', { ascending: false })
        .limit(1)

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

    // Calculate total amount
    let totalAmount = 0
    if (competitionsArray && Array.isArray(competitionsArray)) {
      totalAmount = competitionsArray.reduce((sum: number, comp: CompetitionData) => {
        const competitionAmount = comp.amount || 0
        console.log(`Competition ${comp.competition}: ₹${competitionAmount}`)
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

    console.log(`Total amount calculated: ₹${totalAmount}`)

    // Create PhonePe order
    const merchantOrderId = `ROBOMANIA_${finalTeamId.slice(0, 8)}_${uuid().slice(0, 8)}`
    const competitionNames = competitionsArray.map((c: CompetitionData) => c.competition).join(',')
    
    // Include merchantOrderId in redirect URL for callback - use auto-detected baseUrl
    const redirectUrl = `${baseUrl}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
    
    console.log('🔗 PhonePe redirect URL:', redirectUrl)
    console.log('Creating PhonePe order...')
    
    const sdkOrderRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(totalAmount * 100) // PhonePe expects amount in paise (100 paise = 1 rupee)
      .message(`Payment for ${competitionNames}`)
      .redirectUrl(redirectUrl)
      .expireAfter(1800) // 30 minutes expiry in seconds (max 3600 seconds = 1 hour)
      .build()

    const orderResponse = await phonepeClient.createSdkOrder(sdkOrderRequest)
    
    console.log('✅ PhonePe order created:', merchantOrderId)

    // Save competition registrations
    if (finalTeamId && competitionsArray.length > 0) {
      console.log(`Saving ${competitionsArray.length} competition registrations...`)
      
      for (const comp of competitionsArray) {
        let botIdToUse = comp.botId || null

        // Create bot in database if robot details are provided and botId is not already set
        if (!botIdToUse && (comp.robotName || comp.robotWeight || comp.robotDimensions)) {
          console.log(`Creating bot for ${comp.competition}:`, comp.robotName)
          
          const { data: newBot, error: botError } = await supabaseAdmin
            .from('bots')
            .insert({
              team_id: finalTeamId,
              bot_name: comp.robotName || `Bot for ${comp.competition}`,
              weight: comp.robotWeight || 5,
              dimensions: comp.robotDimensions || '30x30x30',
              weapon_type: comp.weaponType || null,
              is_weapon_bot: !!(comp.weaponType && comp.weaponType.trim() !== '')
            })
            .select('id')
            .single()

          if (botError) {
            console.error(`❌ Failed to create bot for ${comp.competition}:`, botError)
          } else if (newBot) {
            botIdToUse = newBot.id
            console.log(`✅ Bot created with ID: ${botIdToUse}`)
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
                payment_id: merchantOrderId, 
                payment_status: 'PENDING', 
                amount: comp.amount,
                payment_gateway: 'PHONEPE'
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
              payment_id: merchantOrderId, 
              payment_status: 'PENDING', 
              registration_status: 'PENDING',
              payment_gateway: 'PHONEPE'
            })
          
          console.log(`✅ Created new registration for ${comp.competition}${botIdToUse ? ` with bot ${botIdToUse}` : ''}`)
        }
      }
    }

    // Update teams table with payment ID
    await supabaseAdmin
      .from('teams')
      .update({ 
        payment_id: merchantOrderId, 
        is_multi_competition: competitionsArray.length > 1 
      })
      .eq('id', finalTeamId)

    console.log('✅ PhonePe order creation complete!')

    return NextResponse.json({
      success: true,
      merchantOrderId: merchantOrderId,
      token: orderResponse.token,
      expireAt: orderResponse.expireAt,
      totalAmount: totalAmount,
      teamId: finalTeamId,
      registrationId: finalTeamId,
      competitions: competitionNames,
      gateway: 'phonepe'
    })
  } catch (error) {
    console.error('❌ PhonePe order creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create PhonePe order', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
