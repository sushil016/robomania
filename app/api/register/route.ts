import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendRegistrationEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate team name uniqueness
    const existingTeam = await prisma.team.findUnique({
      where: { teamName: data.teamName }
    })

    if (existingTeam) {
      return NextResponse.json(
        { message: 'Team name already exists' },
        { status: 400 }
      )
    }

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
        robotWeight: parseFloat(data.robotWeight),
        robotDimensions: data.robotDimensions,
        weaponType: data.weaponType,
        members: {
          create: data.members.map(member => ({
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role
          }))
        }
      }
    })

    // Send confirmation email
    await sendRegistrationEmail({
      teamName: team.teamName,
      leaderName: team.leaderName,
      leaderEmail: team.leaderEmail,
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 