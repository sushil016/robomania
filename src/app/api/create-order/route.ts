import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const { teamId, amount } = await request.json()

    if (!teamId || !amount) {
      return NextResponse.json({
        success: false,
        message: 'Team ID and amount are required'
      }, { status: 400 })
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${teamId}`,
      notes: {
        teamId: teamId
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create payment order'
    }, { status: 500 })
  }
} 