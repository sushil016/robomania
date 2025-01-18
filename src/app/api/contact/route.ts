import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      contact
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to submit contact form'
    }, { status: 500 })
  }
} 