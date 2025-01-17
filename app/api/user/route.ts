import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Get the token from the cookie
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: token.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        team: {
          select: {
            id: true,
            teamName: true,
            status: true,
            paymentStatus: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 