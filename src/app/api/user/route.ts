import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (error) {
      console.error('User fetch error:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Update user profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('email', session.user.email)
      .select()
      .single()

    if (error) {
      console.error('User update error:', error)
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, user: profile })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
