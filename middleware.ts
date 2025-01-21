import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: Request) {
  const session = await auth()
  
  if (!session && !request.url.includes('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/team-register/:path*',
    '/dashboard/:path*',
    '/profile/:path*'
  ]
}