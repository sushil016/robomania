import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    console.log('Session:', session?.user?.email)

    if (!session?.user?.email || session.user.email !== 'sahanisushil325@gmail.com') {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized',
        teams: [] 
      }, { status: 401 })
    }

    const teams = await prisma.team.findMany({
      select: {
        id: true,
        teamName: true,
        institution: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Teams found:', teams.length)

    return NextResponse.json({
      success: true,
      teams: teams
    })
  } catch (error) {
    console.error('Teams API error:', error)
    return NextResponse.json({ 
      success: false, 
      teams: [],
      message: error instanceof Error ? error.message : 'Failed to fetch teams'
    }, { status: 500 })
  }
} 