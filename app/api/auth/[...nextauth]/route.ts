import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Prisma } from '@prisma/client'


export const authOptions = {
  adapter: PrismaAdapter(Prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/registration',
    error: '/registration',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/registration`
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 