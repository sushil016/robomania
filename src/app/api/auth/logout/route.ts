import { NextResponse } from 'next/server'
import { signOut } from '@/auth'

export async function POST() {
  try {
    await signOut({ redirect: false })
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
