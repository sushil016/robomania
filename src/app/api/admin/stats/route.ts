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
        message: 'Unauthorized'
      }, { status: 401 })
    }

    const [totalTeams, pendingPayments] = await Promise.all([
      prisma.team.count(),
      prisma.team.count({
        where: {
          paymentStatus: 'PENDING'
        }
      })
    ])

    // For now, using fixed amount per team
    const registrationFee = 200 // ₹200 per team
    const completedPayments = await prisma.team.count({
      where: {
        paymentStatus: 'COMPLETED'
      }
    })

    return NextResponse.json({
      totalTeams,
      pendingPayments,
      totalRevenue: completedPayments * registrationFee
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ 
      totalTeams: 0,
      pendingPayments: 0,
      totalRevenue: 0
    }, { status: 500 })
  }
} 