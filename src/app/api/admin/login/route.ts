import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

const ADMIN_EMAIL = 'admin@robomania.com'
const ADMIN_PASSWORD = 'admin123' // In production, use environment variables

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d'
    })

    // Set cookie
    const cookieStore = await cookies() // Await to get the cookies object
    await cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
} 