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

    console.log('Payment verification request:', { orderId, paymentId, teamId, competitionsCount: competitions?.length })

    // Verify signature
    const text = orderId + "|" + paymentId
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (generated_signature !== signature) {
      console.error('Invalid payment signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('✅ Payment signature verified successfully')

    // Update competition_registrations table (new multi-competition system)
    if (teamId) {
      // Find all registrations with this payment_id (orderId)
      const { data: registrations, error: fetchError } = await supabaseAdmin
        .from('competition_registrations')
        .select('*')
        .eq('payment_id', orderId)

      if (fetchError) {
        console.error('Failed to fetch competition registrations:', fetchError)
      } else if (registrations && registrations.length > 0) {
        console.log(`Found ${registrations.length} competition registrations to update`)
        
        // Update all registrations with this payment_id to COMPLETED
        const { error: updateError } = await supabaseAdmin
          .from('competition_registrations')
          .update({
            payment_status: 'COMPLETED',
            registration_status: 'CONFIRMED',
            payment_date: new Date().toISOString()
          })
          .eq('payment_id', orderId)

        if (updateError) {
          console.error('Failed to update competition registrations:', updateError)
        } else {
          console.log('✅ Competition registrations updated to COMPLETED')
        }
      } else {
        console.log('No competition registrations found with orderId:', orderId)
      }
    }

    // Update teams table (for backward compatibility and overall status)
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
        console.log('✅ Team payment status updated successfully for teamId:', teamId)
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
      } else {
        console.log('✅ Team payment status updated by orderId')
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified and registrations confirmed'
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
