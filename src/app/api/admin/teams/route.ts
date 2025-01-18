import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
} 