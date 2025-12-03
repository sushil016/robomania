import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      userEmail, 
      botName, 
      weight, 
      dimensions, 
      weaponType, 
      description,
      imageUrl,
      isWeaponBot 
    } = body

    // Validation
    if (!userEmail || !botName || !weight || !dimensions) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, botName, weight, dimensions' },
        { status: 400 }
      )
    }

    // Check if bot with same name exists for this user
    const { data: existingBot } = await supabaseAdmin
      .from('bots')
      .select('id')
      .eq('user_email', userEmail)
      .eq('bot_name', botName)
      .single()

    if (existingBot) {
      // Update existing bot
      const { data: updatedBot, error } = await supabaseAdmin
        .from('bots')
        .update({
          weight: parseFloat(weight),
          dimensions,
          weapon_type: weaponType || null,
          description: description || null,
          image_url: imageUrl || null,
          is_weapon_bot: isWeaponBot || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingBot.id)
        .select()
        .single()

      if (error) {
        console.error('Failed to update bot:', error)
        return NextResponse.json(
          { error: 'Failed to update bot', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Bot updated successfully',
        bot: updatedBot
      })
    }

    // Create new bot
    const { data: newBot, error } = await supabaseAdmin
      .from('bots')
      .insert({
        user_email: userEmail,
        bot_name: botName,
        weight: parseFloat(weight),
        dimensions,
        weapon_type: weaponType || null,
        description: description || null,
        image_url: imageUrl || null,
        is_weapon_bot: isWeaponBot || false
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create bot:', error)
      return NextResponse.json(
        { error: 'Failed to save bot', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bot saved successfully',
      bot: newBot
    })
  } catch (error) {
    console.error('Bot save error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
