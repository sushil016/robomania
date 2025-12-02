# Migration from Prisma to Supabase

This document outlines the complete migration from Prisma to Supabase for the RoboMania project.

## Overview
- **From**: Prisma ORM with PostgreSQL
- **To**: Supabase (PostgreSQL with built-in Auth and APIs)
- **Authentication**: Changed from GitHub OAuth to Google OAuth only

## Prerequisites

1. **Supabase Account**: Create a project at https://supabase.com
2. **Google OAuth Credentials**: Get from https://console.cloud.google.com
3. **Environment Variables**: Update your `.env` file based on `.env.example`

## Step 1: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Verify all tables are created by checking the **Table Editor**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 2: Configure Google OAuth in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Step 3: Update Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Other services (Razorpay, Resend, etc.)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=your-admin-email
```

## Step 4: Install Dependencies

```bash
# Remove Prisma packages
npm uninstall prisma @prisma/client @auth/prisma-adapter

# Install/verify Supabase is installed
npm install @supabase/supabase-js

# Install other dependencies if needed
npm install
```

## Step 5: Update Package Scripts

The `package.json` has been updated to remove Prisma-specific scripts:
- Removed `prisma generate` from postinstall
- Removed `prisma generate` from build

## Step 6: Database Schema

The migration creates the following tables:

### Core Tables
- `profiles` - User profiles (extends Supabase Auth)
- `teams` - Robot team registrations
- `team_members` - Team member details
- `contacts` - Contact form submissions  
- `newsletter` - Newsletter subscriptions
- `admins` - Admin users (separate from regular auth)

### Key Features
- **Row Level Security (RLS)** enabled on all tables
- **Automatic triggers** for `updated_at` timestamps
- **Foreign key constraints** for data integrity
- **Indexes** on frequently queried columns

## Step 7: API Routes Migration Status

### ✅ Completed
- `/api/auth/*` - Updated to use Google OAuth with Supabase
- `/api/register` - Team registration with Supabase
- `/api/team-details` - Fetch team details from Supabase
- `/api/check-registration` - Check if user has registered
- `/api/payment` - Payment initialization with Supabase

### 🔄 Requires Manual Update
The following routes still need to be updated to use Supabase:

1. **Payment Routes**
   - `/api/verify-payment` - Update to use Supabase
   - `/api/create-order` - Update to use Supabase
   - `/api/payment/verify` - Update to use Supabase

2. **Admin Routes**
   - `/api/admin/teams` - Update to use Supabase
   - `/api/admin/stats` - Update to use Supabase
   - `/api/admin/analytics` - Update to use Supabase
   - `/api/admin/login` - Update to use Supabase
   - `/api/admin/send-update` - Update to use Supabase

3. **Other Routes**
   - `/api/contact` - Update to use Supabase
   - `/api/newsletter` - Update to use Supabase
   - `/api/user` - Update to use Supabase
   - `/api/team-details/update` - Update to use Supabase

## Step 8: Update Remaining API Routes

For each route that uses `prisma`, replace with `supabaseAdmin`:

### Example Pattern:

**Before (Prisma):**
```typescript
import { prisma } from '@/lib/prisma'

const team = await prisma.team.findUnique({
  where: { id: teamId },
  include: { members: true }
})
```

**After (Supabase):**
```typescript
import { supabaseAdmin } from '@/lib/supabase'

const { data: team, error } = await supabaseAdmin
  .from('teams')
  .select(`*, team_members(*)`)
  .eq('id', teamId)
  .single()
```

### Key Differences:
- **Table names**: Use snake_case (e.g., `team_members` not `teamMember`)
- **Column names**: Use snake_case (e.g., `team_name` not `teamName`)
- **Relations**: Use nested select syntax `table(*)`
- **Error handling**: Check for `error` object
- **Single records**: Use `.single()` method

## Step 9: Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Navigate to `/auth/login`
   - Sign in with Google
   - Verify user profile is created in Supabase

3. **Test registration:**
   - Register a new team
   - Verify data appears in Supabase tables

4. **Test admin functions:**
   - Log in as admin
   - Verify admin dashboard works

## Step 10: Data Migration (if needed)

If you have existing data in Prisma/PostgreSQL:

1. Export data from old database
2. Transform data to match new schema (snake_case columns)
3. Import into Supabase using SQL Editor or CSV import

## Troubleshooting

### Authentication Issues
- Verify Google OAuth is enabled in Supabase
- Check redirect URLs match exactly
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Database Connection
- Verify Supabase URL and keys in `.env`
- Check Supabase project is not paused
- Ensure service role key is used for admin operations

### RLS Policies
- If queries fail, check RLS policies in Supabase dashboard
- Admin operations should use `supabaseAdmin` (service role)
- User operations should respect RLS policies

## Benefits of This Migration

1. **Simplified Backend**: No need to manage Prisma schema and migrations
2. **Built-in Authentication**: Supabase Auth handles OAuth providers
3. **Real-time Capabilities**: Can add real-time subscriptions easily
4. **Row Level Security**: Database-level security policies
5. **Auto-generated APIs**: REST and GraphQL APIs included
6. **Storage**: File storage available if needed
7. **Dashboard**: Visual database management

## Next Steps

1. Complete migration of remaining API routes
2. Test all functionality thoroughly
3. Update any frontend components that reference Prisma types
4. Deploy to production with production Supabase project

## Support

- Supabase Docs: https://supabase.com/docs
- NextAuth.js Docs: https://next-auth.js.org/
- Project Issues: Create issue in repository
