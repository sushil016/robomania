import { auth } from "@/auth"

export default auth((req) => {
  const isAuth = !!req.auth
  const isOnTeamRegister = req.nextUrl.pathname.startsWith('/team-register')

  if (isOnTeamRegister && !isAuth) {
    return Response.redirect(new URL('/auth', req.url))
  }
})

export const config = {
  matcher: [
    '/team-register/:path*',
    '/api/auth/:path*'
  ]
}