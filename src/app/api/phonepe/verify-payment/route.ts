import { NextResponse } from 'next/server'
import phonepeClient from '@/lib/phonepe'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Manual PhonePe payment verification endpoint
 * Used to check and update payment status for a specific order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantOrderId, email } = body

    console.log('Manual PhonePe verification request:', { merchantOrderId, email })

    if (!merchantOrderId) {
      return NextResponse.json({ error: 'merchantOrderId is required' }, { status: 400 })
    }

    // Get order status from PhonePe
    console.log('Fetching order status from PhonePe...')
    const statusResponse = await phonepeClient.getOrderStatus(merchantOrderId, true)
    
    console.log('PhonePe order status:', {
      state: statusResponse.state,
      amount: statusResponse.amount,
      orderId: statusResponse.orderId
    })

    // If payment is completed, update database
    if (statusResponse.state === 'COMPLETED') {
      console.log('✅ Payment is COMPLETED, updating database...')
      
      const transactionId = statusResponse.paymentDetails?.[0]?.transactionId || ''
      const paymentMode = statusResponse.paymentDetails?.[0]?.paymentMode || 'UNKNOWN'
      
      // Update competition_registrations
      const { data: registrations, error: fetchError } = await supabaseAdmin
        .from('competition_registrations')
        .select('*')
        .eq('payment_id', merchantOrderId)

      if (fetchError) {
        console.error('Failed to fetch competition registrations:', fetchError)
        return NextResponse.json({ 
          error: 'Failed to fetch registrations',
          details: fetchError.message 
        }, { status: 500 })
      }

      if (registrations && registrations.length > 0) {
        console.log(`Found ${registrations.length} registrations to update`)
        
        // Update all registrations
        for (const registration of registrations) {
          const { error: updateError } = await supabaseAdmin
            .from('competition_registrations')
            .update({
              payment_status: 'COMPLETED',
              registration_status: 'CONFIRMED',
              phonepe_transaction_id: transactionId,
              payment_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', registration.id)
          
          if (updateError) {
            console.error(`Failed to update registration ${registration.id}:`, updateError)
          } else {
            console.log(`✅ Updated registration ${registration.id} for ${registration.competition_type}`)
          }
        }

        // Update team status
        const teamId = registrations[0].team_id
        const { error: teamUpdateError } = await supabaseAdmin
          .from('teams')
          .update({
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', teamId)
        
        if (teamUpdateError) {
          console.error('Failed to update team:', teamUpdateError)
        } else {
          console.log(`✅ Updated team ${teamId} payment status`)
        }

        return NextResponse.json({
          success: true,
          message: 'Payment verified and database updated successfully',
          state: statusResponse.state,
          transactionId: transactionId,
          paymentMode: paymentMode,
          amount: statusResponse.amount / 100,
          updatedRegistrations: registrations.length,
          teamId: teamId
        })
      } else {
        console.warn('⚠️ No registrations found for this order')
        return NextResponse.json({
          success: true,
          message: 'Payment is completed but no registrations found',
          state: statusResponse.state,
          transactionId: transactionId,
          paymentMode: paymentMode,
          amount: statusResponse.amount / 100
        })
      }
    } else if (statusResponse.state === 'PENDING') {
      console.log('⏳ Payment is still PENDING')
      return NextResponse.json({
        success: false,
        message: 'Payment is still pending',
        state: statusResponse.state,
        amount: statusResponse.amount / 100
      }, { status: 202 }) // 202 Accepted - still processing
    } else if (statusResponse.state === 'FAILED') {
      console.log('❌ Payment FAILED')
      return NextResponse.json({
        success: false,
        message: 'Payment has failed',
        state: statusResponse.state,
        errorCode: statusResponse.errorCode,
        amount: statusResponse.amount / 100
      }, { status: 400 })
    } else {
      console.log('⚠️ Unknown payment state:', statusResponse.state)
      return NextResponse.json({
        success: false,
        message: `Unknown payment state: ${statusResponse.state}`,
        state: statusResponse.state,
        amount: statusResponse.amount / 100
      }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Manual PhonePe verification error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to verify PhonePe payment', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
