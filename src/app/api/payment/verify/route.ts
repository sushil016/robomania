import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

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
    const { orderId, paymentId, signature, teamId, competitions, userEmail } = body

    // Verify signature
    const text = orderId + "|" + paymentId
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (generated_signature !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Update payment status in teams table
    // First try by teamId (direct), then by payment_id (backwards compatibility)
    let teamUpdateSuccess = false
    
    if (teamId) {
      const { error: teamError } = await supabaseAdmin
        .from('teams')
        .update({
          payment_status: 'COMPLETED',
          status: 'CONFIRMED',
          payment_id: paymentId,
          payment_date: new Date().toISOString()
        })
        .eq('id', teamId)

      if (!teamError) {
        teamUpdateSuccess = true
        console.log('Team payment status updated successfully for teamId:', teamId)
      } else {
        console.error('Failed to update team by teamId:', teamError)
      }
    }
    
    // Fallback: try updating by order_id (payment_id column)
    if (!teamUpdateSuccess) {
      const { error: teamError } = await supabaseAdmin
        .from('teams')
        .update({
          payment_status: 'COMPLETED',
          status: 'CONFIRMED',
          payment_date: new Date().toISOString()
        })
        .eq('payment_id', orderId)

      if (teamError) {
        console.error('Failed to update team payment status by orderId:', teamError)
      }
    }

    // If competitions data is provided, create competition registrations
    if (competitions && Array.isArray(competitions) && teamId && userEmail) {
      const registrationsToInsert = competitions.map((comp: CompetitionData) => ({
        team_id: teamId,
        user_email: userEmail,
        competition: comp.competition,
        amount: comp.amount,
        robot_name: comp.robotName || null,
        robot_weight: comp.robotWeight || null,
        robot_dimensions: comp.robotDimensions || null,
        weapon_type: comp.weaponType || null,
        payment_id: paymentId,
        payment_status: 'COMPLETED',
        payment_date: new Date().toISOString(),
        status: 'CONFIRMED'
      }))

      const { error: compError } = await supabaseAdmin
        .from('competition_registrations')
        .insert(registrationsToInsert)

      if (compError) {
        console.error('Failed to create competition registrations:', compError)
        // Check for unique constraint violation - means already registered
        if (compError.code === '23505') {
          return NextResponse.json(
            { error: 'One or more competitions already registered', success: false },
            { status: 409 }
          )
        }
        return NextResponse.json(
          { error: 'Failed to create competition registrations' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified and registrations confirmed'
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
