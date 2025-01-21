import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        isAdmin: session.user.email === 'sahanisushil325@gmail.com'
      }
    })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}