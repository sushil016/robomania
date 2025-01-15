import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { paymentId, orderId, signature } = await request.json()

    // Verify the payment signature
    const text = orderId + "|" + paymentId
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature === signature) {
      // Update payment status in database
      // await prisma.payment.update({ ... })
      
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 