import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendStatusUpdateEmail } from '@/lib/email'

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

    if (expectedSignature === signature) {
      // Update team status
      const team = await prisma.team.update({
        where: { id: teamId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'APPROVED',
          paymentId: paymentId,
          paymentDate: new Date()
        },
        include: {
          members: true // Include members to get leader details
        }
      })

      // Send success email using the existing template
      await sendStatusUpdateEmail({
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        status: 'Payment Completed',
        message: `Your payment of ₹200 has been successfully processed. Your team is now fully registered for RoboMania 2025!`
      })

      return NextResponse.json({ success: true, team })
    } else {
      // Payment failed
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true
        }
      })
      
      if (team) {
        await sendStatusUpdateEmail({
          teamName: team.teamName,
          leaderName: team.leaderName,
          leaderEmail: team.leaderEmail,
          status: 'Payment Failed',
          message: 'Your payment was unsuccessful. Please try again from your registration details page.'
        })
      }

      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 