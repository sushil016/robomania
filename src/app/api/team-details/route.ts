import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    if (!token?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const team = await prisma.team.findFirst({
      where: {
        userEmail: token.email as string
      },
      select: {
        id: true,
        teamName: true,
        institution: true,
        status: true,
        paymentStatus: true,
        contactEmail: true,
        contactPhone: true,
        leaderName: true,
        leaderEmail: true,
        leaderPhone: true,
        robotName: true
      }
    })

    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      team
    })
  } catch (error) {
    console.error('Failed to fetch team details:', error)
    return NextResponse.json(
      { message: 'Failed to fetch team details' },
      { status: 500 }
    )
  }
} 