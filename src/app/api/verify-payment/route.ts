import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
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
      const { data: team, error: updateError } = await supabaseAdmin
        .from('teams')
        .update({
          payment_status: 'COMPLETED',
          status: 'APPROVED',
          payment_id: paymentId,
          payment_date: new Date().toISOString()
        })
        .eq('id', teamId)
        .select('*, team_members(*)')
        .single()

      if (updateError) {
        console.error('Failed to update team:', updateError)
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 })
      }

      // Send success email
      if (team) {
        try {
          await sendStatusUpdateEmail({
            teamName: team.team_name,
            leaderName: team.leader_name,
            leaderEmail: team.leader_email,
            status: 'Payment Completed',
            message: `Your payment of ₹200 has been successfully processed. Your team is now fully registered for RoboMania 2025!`
          })
        } catch (emailError) {
          console.error('Failed to send email:', emailError)
        }
      }

      return NextResponse.json({ success: true, team })
    } else {
      // Payment failed
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()
      
      if (team) {
        try {
          await sendStatusUpdateEmail({
            teamName: team.team_name,
            leaderName: team.leader_name,
            leaderEmail: team.leader_email,
            status: 'Payment Failed',
            message: 'Your payment was unsuccessful. Please try again from your registration details page.'
          })
        } catch (emailError) {
          console.error('Failed to send email:', emailError)
        }
      }

      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
