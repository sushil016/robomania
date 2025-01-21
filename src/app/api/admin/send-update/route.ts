import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message, sendTo } = await request.json()

    // Get all registered teams
    const teams = await prisma.team.findMany({
      where: sendTo === 'PAID' ? { paymentStatus: 'COMPLETED' } : {}
    })

    // Send emails to all team contacts
    await Promise.all(
      teams.map(team => 
        sendEmail({
          to: team.contactEmail,
          subject,
          html: `
            <h1>${subject}</h1>
            <p>Dear ${team.teamName},</p>
            ${message}
          `
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 