import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for browser/client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (you can generate these with Supabase CLI)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          user_id: string | null
          user_email: string
          team_name: string
          institution: string
          contact_email: string
          contact_phone: string
          leader_name: string
          leader_email: string
          leader_phone: string
          robot_name: string
          robot_weight: number
          robot_dimensions: string
          weapon_type: string
          status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'
          payment_id: string | null
          payment_status: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_email: string
          team_name: string
          institution: string
          contact_email: string
          contact_phone: string
          leader_name: string
          leader_email: string
          leader_phone: string
          robot_name: string
          robot_weight: number
          robot_dimensions: string
          weapon_type: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'
          payment_id?: string | null
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_email?: string
          team_name?: string
          institution?: string
          contact_email?: string
          contact_phone?: string
          leader_name?: string
          leader_email?: string
          leader_phone?: string
          robot_name?: string
          robot_weight?: number
          robot_dimensions?: string
          weapon_type?: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'
          payment_id?: string | null
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          name: string
          email: string
          phone: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          name: string
          email: string
          phone: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          name?: string
          email?: string
          phone?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: 'PENDING' | 'RESPONDED' | 'ARCHIVED'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: 'PENDING' | 'RESPONDED' | 'ARCHIVED'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: 'PENDING' | 'RESPONDED' | 'ARCHIVED'
          created_at?: string
        }
      }
      newsletter: {
        Row: {
          id: string
          email: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          active?: boolean
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
          created_at?: string
        }
      }
    }
  }
}
