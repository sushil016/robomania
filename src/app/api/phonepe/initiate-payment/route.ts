import { NextResponse } from 'next/server'
import phonepeClient from '@/lib/phonepe'
import { StandardCheckoutPayRequest } from 'pg-sdk-node'
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantOrderId, amount, userEmail, teamName } = body

    // Get the base URL from request headers
    const baseUrl = await getBaseUrl()
    console.log('📍 Base URL for callbacks:', baseUrl)

    console.log('PhonePe initiate payment request:', { merchantOrderId, amount })

    if (!merchantOrderId || !amount) {
      return NextResponse.json({ error: 'merchantOrderId and amount are required' }, { status: 400 })
    }

    // Build the payment redirect URL with merchantOrderId - use auto-detected baseUrl
    const redirectUrl = `${baseUrl}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
    
    console.log('🔗 PhonePe redirect URL:', redirectUrl)

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
