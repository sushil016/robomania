import { NextResponse } from 'next/server'
import phonepeClient from '@/lib/phonepe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantOrderId } = body

    console.log('PhonePe order status check:', { merchantOrderId })

    if (!merchantOrderId) {
      return NextResponse.json({ error: 'merchantOrderId is required' }, { status: 400 })
    }

    // Get order status from PhonePe
    const statusResponse = await phonepeClient.getOrderStatus(merchantOrderId, true) // true = get all attempt details

    console.log('PhonePe order status:', statusResponse.state)

    // If payment is completed, update database
    if (statusResponse.state === 'COMPLETED') {
      console.log('✅ Payment completed, updating database...')
      
      // Get transaction ID from payment details
      const transactionId = statusResponse.paymentDetails?.[0]?.transactionId || ''
      
      // Update competition_registrations
      const { data: registrations, error: fetchError } = await supabaseAdmin
        .from('competition_registrations')
        .select('*')
        .eq('payment_id', merchantOrderId)

      if (fetchError) {
        console.error('Failed to fetch competition registrations:', fetchError)
      } else if (registrations && registrations.length > 0) {
        console.log(`Found ${registrations.length} competition registrations to update`)
        
        for (const registration of registrations) {
          await supabaseAdmin
            .from('competition_registrations')
            .update({
              payment_status: 'COMPLETED',
              registration_status: 'CONFIRMED',
              phonepe_transaction_id: transactionId,
              updated_at: new Date().toISOString()
            })
            .eq('id', registration.id)
          
          console.log(`✅ Updated registration ${registration.id} for competition ${registration.competition_type}`)
        }

        // Update team status
        if (registrations.length > 0) {
          const teamId = registrations[0].team_id
          await supabaseAdmin
            .from('teams')
            .update({
              payment_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
          
          console.log(`✅ Updated team ${teamId} payment status`)
        }
      }

      // Fallback: Update teams table if no registrations found
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('payment_id', merchantOrderId)
        .single()

      if (team) {
        await supabaseAdmin
          .from('teams')
          .update({
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', team.id)
        
        console.log(`✅ Updated team ${team.id} via fallback`)
      }
    }

    return NextResponse.json({
      success: true,
      state: statusResponse.state,
      transactionId: statusResponse.paymentDetails?.[0]?.transactionId || '',
      amount: statusResponse.amount / 100, // Convert paise to rupees
      errorCode: statusResponse.errorCode,
      merchantOrderId: merchantOrderId,
      paymentDetails: statusResponse.paymentDetails
    })
  } catch (error) {
    console.error('❌ PhonePe order status error:', error)
    return NextResponse.json({ 
      error: 'Failed to check PhonePe order status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
