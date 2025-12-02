import { NextResponse } from 'next/server'
import { signIn } from '@/auth'

// Login is handled by NextAuth Google OAuth
// This endpoint redirects to Google OAuth
export async function POST(request: Request) {
  try {
    const { redirectTo } = await request.json()
    
    await signIn('google', {
      redirectTo: redirectTo || '/dashboard',
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Redirect to Google OAuth
  return NextResponse.redirect('/api/auth/signin')
}
