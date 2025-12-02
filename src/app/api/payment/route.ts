import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'

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

    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', body.teamId)
      .single()

    if (error || !team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      )
    }

    const payment = await razorpay.orders.create({
      amount: 200 * 100,
      currency: 'INR',
      receipt: `team_${body.teamId}`,
      notes: {
        teamId: body.teamId,
        teamName: team.team_name
      },
    })

    await supabaseAdmin
      .from('teams')
      .update({ payment_id: payment.id })
      .eq('id', body.teamId)

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { message: 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
