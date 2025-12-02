import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total teams
    const { count: totalTeams } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })

    // Get pending teams
    const { count: pendingTeams } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // Get approved teams
    const { count: approvedTeams } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'APPROVED')

    // Get completed payments
    const { count: completedPayments } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'COMPLETED')

    // Get total contacts
    const { count: totalContacts } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    // Get newsletter subscribers
    const { count: newsletterSubscribers } = await supabaseAdmin
      .from('newsletter')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    return NextResponse.json({
      success: true,
      stats: {
        totalTeams: totalTeams || 0,
        pendingTeams: pendingTeams || 0,
        approvedTeams: approvedTeams || 0,
        completedPayments: completedPayments || 0,
        totalContacts: totalContacts || 0,
        newsletterSubscribers: newsletterSubscribers || 0
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
