import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('id')
      .eq('user_email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to check registration:', error)
      return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 })
    }

    return NextResponse.json({
      hasRegistered: !!team
    })
  } catch (error) {
    console.error('Failed to check registration:', error)
    return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 })
  }
}
