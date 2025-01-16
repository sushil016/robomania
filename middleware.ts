import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      const path = req.nextUrl.pathname
      return true // Allow public access to all other routes
    }
  }
})

export const config = {
  matcher: ['/registration']
} 