import { NextResponse } from 'next/server'

// Signup is handled by NextAuth Google OAuth
// Users are automatically created when they sign in with Google
export async function POST() {
  return NextResponse.json({
    message: 'Please use Google OAuth to sign up',
    redirectTo: '/api/auth/signin'
  }, { status: 400 })
}

export async function GET() {
  return NextResponse.redirect('/api/auth/signin')
}
