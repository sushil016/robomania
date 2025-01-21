import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const updatedTeam = await prisma.team.update({
      where: {
        userEmail: session.user.email
      },
      data: {
        teamName: data.teamName,
        institution: data.institution,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        leaderPhone: data.leaderPhone,
        robotName: data.robotName,
        robotWeight: data.robotWeight,
        robotDimensions: data.robotDimensions,
        weaponType: data.weaponType,
        members: {
          deleteMany: {},
          create: data.members.map((member: any) => ({
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role
          }))
        }
      },
      include: {
        members: true
      }
    })

    return NextResponse.json({ team: updatedTeam })
  } catch (error) {
    console.error('Team update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 