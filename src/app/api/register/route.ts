import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { sendRegistrationEmail, sendEmail, emailTemplates } from '@/lib/email'

const prisma = new PrismaClient()
let resend: Resend | null = null

try {
  resend = new Resend(process.env.RESEND_API_KEY)
} catch (error) {
  console.error('Failed to initialize Resend:', error)
}

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
  userEmail: string
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
          user: {
            connect: {
              email: data.userEmail
            }
          },
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

        // Only try to send email if Resend is initialized
        if (resend) {
          try {
            await sendRegistrationEmail(team)
            await sendEmail({
              to: data.contactEmail,
              ...emailTemplates.teamRegistration(data.teamName)
            })
          } catch (emailError) {
            console.error('Failed to send email:', emailError)
            // Continue execution even if email fails
          }
        }

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