import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: botId } = await params

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID is required' },
        { status: 400 }
      )
    }

    // Get specific bot
    const { data: bot, error } = await supabaseAdmin
      .from('bots')
      .select('*')
      .eq('id', botId)
      .single()

    if (error || !bot) {
      console.error('Bot not found:', error)
      return NextResponse.json(
        { error: 'Bot not found', details: error?.message },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      bot
    })
  } catch (error) {
    console.error('Bot fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: botId } = await params

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID is required' },
        { status: 400 }
      )
    }

    // Delete bot (will cascade to competition_registrations via ON DELETE SET NULL)
    const { error } = await supabaseAdmin
      .from('bots')
      .delete()
      .eq('id', botId)

    if (error) {
      console.error('Failed to delete bot:', error)
      return NextResponse.json(
        { error: 'Failed to delete bot', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bot deleted successfully'
    })
  } catch (error) {
    console.error('Bot delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
