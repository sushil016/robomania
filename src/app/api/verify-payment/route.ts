import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, paymentId, signature, teamId } = await request.json()

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update team status
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'APPROVED',
        paymentId: paymentId,
        paymentDate: new Date()
      }
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 