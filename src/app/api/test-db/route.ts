import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      }, { status: 500 })
    }

    // Get table counts
    const { count: profilesCount } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: teamsCount } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })

    const { count: contactsCount } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      stats: {
        profiles: profilesCount || 0,
        teams: teamsCount || 0,
        contacts: contactsCount || 0
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
