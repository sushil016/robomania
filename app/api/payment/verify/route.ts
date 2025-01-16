import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature } = await request.json()

    // Verify signature
    const text = orderId + "|" + paymentId
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (generated_signature === signature) {
      // Update payment status in database
      await prisma.team.update({
        where: {
          paymentId: orderId
        },
        data: {
          paymentStatus: 'COMPLETED',
          paymentDate: new Date()
        }
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 