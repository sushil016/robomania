import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletter')
      .select('*')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter!' },
        { status: 200 }
      )
    }

    // Subscribe
    const { data, error } = await supabaseAdmin
      .from('newsletter')
      .insert({
        email,
        active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
