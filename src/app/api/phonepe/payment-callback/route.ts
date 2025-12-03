import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import phonepeClient from '@/lib/phonepe'

export async function POST(request: Request) {
  try {
    console.log('========================================')
    console.log('PhonePe POST callback received')
    console.log('========================================')

    // Get callback body and headers
    const body = await request.text()
    const authorization = request.headers.get('authorization') || ''
    
    console.log('Callback body length:', body.length)
    console.log('Authorization header present:', !!authorization)
    console.log('Raw body preview:', body.substring(0, 200))

    // Validate callback using PhonePe SDK
    // Note: You need to set username and password on PhonePe dashboard for callback validation
    const username = process.env.PHONEPE_CALLBACK_USERNAME || ''
    const password = process.env.PHONEPE_CALLBACK_PASSWORD || ''

    if (!username || !password) {
      console.warn('⚠️ PhonePe callback credentials not configured, skipping validation')
    }

    let callbackResponse
    try {
      if (username && password) {
        callbackResponse = phonepeClient.validateCallback(username, password, authorization, body)
        console.log('✅ Callback validated successfully')
      } else {
        // Parse body manually if validation is skipped
        callbackResponse = JSON.parse(body)
      }
    } catch (error) {
      console.error('❌ Callback validation failed:', error)
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 })
    }

    const merchantOrderId = callbackResponse.merchantOrderId || callbackResponse.data?.merchantOrderId

    if (!merchantOrderId) {
      console.error('No merchantOrderId in callback')
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 })
    }

    console.log('Processing callback for order:', merchantOrderId)

    // Get order status from PhonePe to ensure data accuracy
    const statusResponse = await phonepeClient.getOrderStatus(merchantOrderId, true)
    
    console.log('Order status:', statusResponse.state)

    // Update database based on payment status
    if (statusResponse.state === 'COMPLETED') {
      console.log('✅ Payment completed, updating database...')
      
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
          
          console.log(`✅ Updated registration ${registration.id}`)
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
          
          console.log(`✅ Updated team ${teamId}`)
        }
      }

      // Fallback: Update teams table
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
        
        console.log(`✅ Updated team via fallback`)
      }

      // Redirect to success page
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`
      
      return NextResponse.redirect(redirectUrl)
    } else if (statusResponse.state === 'FAILED') {
      console.log('❌ Payment failed')
      
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/team-register?payment=failed`
      
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('⏳ Payment pending')
      
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=pending`
      
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error('❌ PhonePe callback error:', error)
    
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/team-register?payment=error`
    
    return NextResponse.redirect(redirectUrl)
  }
}

// Also handle GET redirects
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    console.log('PhonePe GET callback received with params:', url.searchParams.toString())
    
    // PhonePe may send different parameter names, check all possibilities
    const merchantOrderId = url.searchParams.get('merchantOrderId') || 
                           url.searchParams.get('transactionId') ||
                           url.searchParams.get('merchantTransactionId')

    if (!merchantOrderId) {
      console.error('No merchantOrderId found in callback URL')
      // Redirect to dashboard with a message to check status
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=pending&message=check-status`)
    }

    console.log('Checking order status for:', merchantOrderId)
    
    // Check order status
    const statusResponse = await phonepeClient.getOrderStatus(merchantOrderId, true)
    
    console.log('Order status:', statusResponse.state)
    
    if (statusResponse.state === 'COMPLETED') {
      // Update database
      const transactionId = statusResponse.paymentDetails?.[0]?.transactionId || ''
      
      const { data: registrations } = await supabaseAdmin
        .from('competition_registrations')
        .select('*')
        .eq('payment_id', merchantOrderId)

      if (registrations && registrations.length > 0) {
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
        }

        // Update team
        const teamId = registrations[0].team_id
        await supabaseAdmin
          .from('teams')
          .update({
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', teamId)
        
        console.log('✅ Database updated for completed payment')
      }
      
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success&gateway=phonepe`)
    } else if (statusResponse.state === 'FAILED') {
      console.log('❌ Payment failed')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/team-register?payment=failed&gateway=phonepe`)
    } else {
      console.log('⏳ Payment pending')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=pending&gateway=phonepe`)
    }
  } catch (error) {
    console.error('❌ Error in GET callback:', error)
    // Redirect to dashboard with pending status - user can check manually
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=pending&message=verify-manually`)
  }
}
