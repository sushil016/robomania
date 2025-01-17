import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/team-register')) {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/team-register/:path*']
}
