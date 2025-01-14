import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendStatusUpdateEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, message } = await request.json()
    
    const team = await prisma.team.update({
      where: { id: params.id },
      data: { status }
    })

    // Send status update email
    await sendStatusUpdateEmail({
      teamName: team.teamName,
      leaderName: team.leaderName,
      leaderEmail: team.leaderEmail,
      status,
      message,
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 