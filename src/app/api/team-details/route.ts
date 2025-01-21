import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    console.log('Session:', session?.user?.email)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // After the session check, add this debug query
    const allTeams = await prisma.team.findMany({
      select: {
        id: true,
        userEmail: true,
        teamName: true
      }
    })
    console.log('All teams:', allTeams)

    // Then try the main query
    const team = await prisma.team.findUnique({
      where: {
        userEmail: session.user.email
      },
      include: {
        members: true
      }
    })
    
    console.log('Found team:', team)

    if (!team) {
      console.log('No team found for email:', session.user.email)
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Transform to match frontend interface
    const transformedTeam = {
      id: team.id,
      teamName: team.teamName,
      institution: team.institution,
      paymentStatus: team.paymentStatus.toString(),
      registrationStatus: team.status.toString(),
      contactDetails: {
        email: team.contactEmail,
        phone: team.contactPhone
      },
      leader: {
        name: team.leaderName,
        email: team.leaderEmail,
        phone: team.leaderPhone
      },
      members: team.members,
      robotDetails: {
        name: team.robotName,
        weight: team.robotWeight,
        dimensions: team.robotDimensions,
        weaponType: team.weaponType
      }
    }

    return NextResponse.json({ team: transformedTeam })
  } catch (error) {
    console.error('Team details fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 