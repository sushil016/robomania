import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    if (!isAuth && req.nextUrl.pathname.startsWith('/team-register')) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Let the middleware function handle the logic
    },
    pages: {
      signIn: '/auth',
      error: '/auth/error',
    },
  }
);

export const config = {
  matcher: ['/auth', '/team-register/:path*']
};
