import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        if (session.user.email === 'sahanisushil325@gmail.com') {
          session.user.isAdmin = true
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
}) 