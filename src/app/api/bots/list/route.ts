import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      )
    }

    // Get all bots for this user
    const { data: bots, error } = await supabaseAdmin
      .from('bots')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch bots:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bots', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bots: bots || [],
      count: bots?.length || 0
    })
  } catch (error) {
    console.error('Bot list error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
