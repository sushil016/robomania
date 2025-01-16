import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect only registration routes
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require authentication for registration routes
        if (req.nextUrl.pathname.startsWith('/registration')) {
          return !!token;
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/registration/:path*', '/team-register/:path*']
};
