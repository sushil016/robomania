import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            email: session.user.email
          }
        }
      },
      include: {
        members: true
      }
    })

    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error('Failed to fetch team details:', error)
    return NextResponse.json(
      { message: 'Failed to fetch team details' },
      { status: 500 }
    )
  }
} 