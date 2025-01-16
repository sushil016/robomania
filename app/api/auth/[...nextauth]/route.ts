import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Add this line
  pages: {
    signIn: '/registration',
    error: '/registration',
  },
  callbacks: {
    async session({ session, user }: { session: any, user: any }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Only redirect to URLs on your domain
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/registration`
    }
  },
  debug: process.env.NODE_ENV === 'development', // Add this for debugging
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }