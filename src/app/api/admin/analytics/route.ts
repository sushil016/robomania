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

    // Get registration trends (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const registrationTrends = await prisma.team.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Ensure we have data for all days
    const allDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      date.setHours(0, 0, 0, 0)
      
      const existingData = registrationTrends.find(
        item => new Date(item.createdAt).toDateString() === date.toDateString()
      )
      
      allDays.push({
        date: date.toISOString(),
        count: existingData ? existingData._count.id : 0
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        registrationTrends: allDays
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({
      success: true,
      data: {
        registrationTrends: []
      }
    })
  }
} 