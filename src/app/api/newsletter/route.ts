import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Email already subscribed'
      }, { status: 400 })
    }

    const subscription = await prisma.newsletter.create({
      data: {
        email,
        active: true
      }
    })

    return NextResponse.json({
      success: true,
      subscription
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    }, { status: 500 })
  }
} 