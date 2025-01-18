import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.email) {
      return NextResponse.json({ exists: false }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: token.email
      },
      select: {
        id: true
      }
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error('Error checking user:', error)
    return NextResponse.json({ exists: false }, { status: 500 })
  }
} 