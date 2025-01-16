import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendRegistrationEmail } from '@/lib/email'

const prisma = new PrismaClient()

interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
}

interface RegistrationData {
  teamName: string
  institution: string
  contactEmail: string
  contactPhone: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  robotName: string
  robotWeight: string | number
  robotDimensions: string
  weaponType: string
  members: TeamMember[]
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json({
        success: false,
        message: 'No data provided'
      }, { status: 400 })
    }

    const data = await request.json() as RegistrationData
    console.log('Received data:', data)

    // Basic validation
    if (!data.teamName || !data.institution || !data.members) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    try {
      // Create team with members
      const team = await prisma.team.create({
        data: {
          teamName: data.teamName,
          institution: data.institution,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          leaderName: data.leaderName,
          leaderEmail: data.leaderEmail,
          leaderPhone: data.leaderPhone,
          robotName: data.robotName,
          robotWeight: parseFloat(data.robotWeight.toString()),
          robotDimensions: data.robotDimensions,
          weaponType: data.weaponType,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          members: {
            create: data.members.map((member) => ({
              name: member.name,
              email: member.email,
              phone: member.phone,
              role: member.role
            }))
          }
        }
      })

      if (!team) {
        return NextResponse.json({
          success: false,
          message: 'Failed to create team'
        }, { status: 500 })
      }

      try {
        // Initialize payment
        const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId: team.id }),
        })

        const payment = await paymentResponse.json()

        // Send email
        await sendRegistrationEmail({
          teamName: team.teamName,
          leaderName: team.leaderName,
          leaderEmail: team.leaderEmail,
        })

        return NextResponse.json({
          success: true,
          team,
          payment
        })
      } catch (paymentError) {
        // If payment fails, return team data with error
        return NextResponse.json({
          success: false,
          team,
          message: 'Team created but payment initialization failed'
        }, { status: 500 })
      }
    } catch (dbError) {
      // Handle database errors
      const errorMessage = dbError instanceof Error ? dbError.message : 'Failed to process registration'
      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: 500 })
    }
  } catch (error) {
    // Handle request parsing errors
    const errorMessage = error instanceof Error ? error.message : 'Invalid request data'
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 400 })
  }
} 