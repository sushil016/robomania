import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

interface CompetitionData {
  competition: string
  amount: number
  robotName?: string
  robotWeight?: number
  robotDimensions?: string
  weaponType?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, teamId, competitions, userEmail, isNewTeam } = body

    // Support both old single-registration and new multi-competition flow
    if (!teamId && !isNewTeam) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    let teamName = 'Team'
    let finalTeamId = teamId

    // If we have a teamId, fetch team info
    if (teamId) {
      const { data: team, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (error || !team) {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        )
      }
      teamName = team.team_name
      finalTeamId = team.id
    }

    // Calculate total amount from competitions if provided
    let totalAmount = amount
    if (competitions && Array.isArray(competitions)) {
      totalAmount = competitions.reduce((sum: number, comp: CompetitionData) => sum + comp.amount, 0)
    }

    // Create Razorpay order
    // Receipt must be <= 40 chars, so use short ID
    const shortId = finalTeamId ? finalTeamId.slice(0, 8) : 'new'
    const timestamp = Date.now().toString().slice(-8)
    const options = {
      amount: (totalAmount || 200) * 100, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${shortId}_${timestamp}`,
      notes: {
        teamId: finalTeamId || 'pending',
        teamName: teamName,
        userEmail: userEmail || '',
        competitions: competitions ? JSON.stringify(competitions.map((c: CompetitionData) => c.competition)) : '',
        isMultiCompetition: competitions ? 'true' : 'false'
      }
    }

    const order = await razorpay.orders.create(options)

    // If we have a teamId, update team with order ID (backwards compatibility)
    if (finalTeamId) {
      await supabaseAdmin
        .from('teams')
        .update({ payment_id: order.id })
        .eq('id', finalTeamId)
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      totalAmount: totalAmount
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
