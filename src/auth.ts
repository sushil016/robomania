import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        const { data: existingProfile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching profile:', fetchError)
          return false
        }

        if (!existingProfile) {
          // Create new profile (UUID will be auto-generated)
          const { data: newProfile, error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              email: user.email,
              name: user.name || null,
              image: user.image || null,
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error creating profile:', insertError)
            return false
          }

          // Store the generated id back to user object for session
          user.id = newProfile.id
        } else {
          // Update existing profile
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
              name: user.name || existingProfile.name,
              image: user.image || existingProfile.image,
            })
            .eq('email', user.email)

          if (updateError) {
            console.error('Error updating profile:', updateError)
          }

          // Use existing profile id
          user.id = existingProfile.id
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, name, email, image')
          .eq('email', session.user.email)
          .single()

        if (profile) {
          session.user.id = profile.id
          session.user.name = profile.name
          session.user.email = profile.email || ''
          session.user.image = profile.image
        }

        if (session.user.email === process.env.ADMIN_EMAIL || session.user.email === 'sahanisushil325@gmail.com') {
          session.user.isAdmin = true
        }
      }
      return session
    },
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
      }
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
})
