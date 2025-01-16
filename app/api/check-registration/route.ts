import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const team = await prisma.team.findFirst({
      where: {
        userEmail: email
      }
    })

    return NextResponse.json({
      hasRegistered: !!team
    })
  } catch (error) {
    console.error('Failed to check registration:', error)
    return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 })
  }
} 