import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendStatusUpdateEmail } from '@/lib/email'

const prisma = new PrismaClient()

// Define proper route segment config
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Define params type following Next.js 15 conventions
type Context = {
  params: {
    id: string
  }
}

// Note the type annotation for the function itself
export async function PATCH(
  request: NextRequest,
  { params }: Context
): Promise<NextResponse> {
  try {
    const { status, message } = await request.json()
    
    const team = await prisma.team.update({
      where: { id: params.id },
      data: { status }
    })

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