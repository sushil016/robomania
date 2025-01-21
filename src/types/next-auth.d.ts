import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      isAdmin?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string
  }
} 