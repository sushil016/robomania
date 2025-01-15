import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.teamId) {
      return NextResponse.json(
        { message: 'Team ID is required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { id: body.teamId }
    })

    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      )
    }

    const payment = await razorpay.orders.create({
      amount: 200 * 100, // amount in paisa
      currency: 'INR',
      receipt: `team_${body.teamId}`,
      notes: {
        teamId: body.teamId,
        teamName: team.teamName
      },
    })

    // Update team with payment ID
    await prisma.team.update({
      where: { id: body.teamId },
      data: { paymentId: payment.id }
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { message: 'Payment initialization failed' },
      { status: 500 }
    )
  }
} 