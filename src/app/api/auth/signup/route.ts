import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json().catch((e) => {
      console.error('JSON parse error:', e)
      return null
    })

    if (!body) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email, password, name } = body
    console.log('Received signup request for:', { email, name }) // Log request data

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      }).catch((e) => {
        console.error('Database query error:', e)
        return null
      })

      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        }
      }).catch((e) => {
        console.error('User creation error:', e)
        throw e
      })

      if (!user) {
        throw new Error('Failed to create user')
      }

      // Create JWT payload with more user data
      const jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        timestamp: Date.now()
      }

      const token = await new SignJWT(jwtPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .setIssuedAt()
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))

      const response = NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })

      // Set cookie with stronger security
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      })

      return response
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return NextResponse.json(
        { 
          message: 'Database operation failed',
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 