import { NextResponse } from 'next/server'
import phonepeClient from '@/lib/phonepe'
import { StandardCheckoutPayRequest } from 'pg-sdk-node'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantOrderId, amount, userEmail, teamName } = body

    console.log('PhonePe initiate payment request:', { merchantOrderId, amount })

    if (!merchantOrderId || !amount) {
      return NextResponse.json({ error: 'merchantOrderId and amount are required' }, { status: 400 })
    }

    // Build the payment redirect URL with merchantOrderId
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
    
    // Create payment request
    const payRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // Amount in paise
      .message(`Payment for RoboMania - ${teamName || 'Team'}`)
      .redirectUrl(redirectUrl)
      .expireAfter(1800) // 30 minutes in seconds (max 3600 seconds = 1 hour)
      .build()

    console.log('Initiating PhonePe payment...')
    
    const payResponse = await phonepeClient.pay(payRequest)
    
    console.log('✅ PhonePe payment initiated, redirect URL:', payResponse.redirectUrl)

    return NextResponse.json({
      success: true,
      redirectUrl: payResponse.redirectUrl,
      merchantOrderId: merchantOrderId
    })
  } catch (error) {
    console.error('❌ PhonePe payment initiation error:', error)
    return NextResponse.json({ 
      error: 'Failed to initiate PhonePe payment', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
