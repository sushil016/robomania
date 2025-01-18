import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [totalTeams, pendingPayments, completedPayments] = await Promise.all([
      prisma.team.count(),
      prisma.team.count({
        where: { paymentStatus: 'PENDING' }
      }),
      prisma.team.count({
        where: { paymentStatus: 'COMPLETED' }
      })
    ])

    return NextResponse.json({
      totalTeams,
      pendingPayments,
      totalRevenue: completedPayments * 200 // ₹200 per team
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 