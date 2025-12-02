# 🚀 DATABASE SETUP REQUIRED

## Error: "Could not find the table 'public.profiles' in the schema cache"

Your Supabase database tables haven't been created yet. You need to run the migration SQL script.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `nmtwczueujgvopyrfubh`
3. Click on **SQL Editor** in the left sidebar (or click the SQL icon)

### Step 2: Copy the Migration SQL

1. Open the file: `/Users/sushilsahani/devsushil/robomania/supabase/migrations/001_initial_schema.sql`
2. Copy **ALL** the content (entire file, 215 lines)

### Step 3: Run the SQL in Supabase

1. In the SQL Editor, click **New Query**
2. Paste the entire SQL content from `001_initial_schema.sql`
3. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
4. Wait for it to complete (should take a few seconds)

### Step 4: Verify Tables Were Created

In the SQL Editor, run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see these tables:
- ✅ profiles
- ✅ teams
- ✅ team_members
- ✅ contacts
- ✅ newsletter
- ✅ admins

### Step 5: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign In"
3. Sign in with Google
4. ✅ You should now be authenticated successfully!

---

## 🎯 What This Migration Creates

The SQL migration creates:

### Tables:
- **profiles** - User profiles (linked to Supabase Auth)
- **teams** - Team registrations
- **team_members** - Team member details
- **contacts** - Contact form submissions
- **newsletter** - Newsletter subscriptions
- **admins** - Admin users

### Security:
- Row Level Security (RLS) policies
- Automatic timestamps (created_at, updated_at)
- Foreign key constraints

### Enums:
- registration_status
- payment_status
- contact_status
- admin_role

---

## ⚠️ Common Issues

### Issue: "permission denied for schema public"
**Fix:** Make sure you're logged in as the project owner/admin

### Issue: "type already exists"
**Fix:** The migration has already been run. Check the tables in the Table Editor.

### Issue: SQL Editor won't load
**Fix:** Check your internet connection and Supabase dashboard status

---

## 📸 Quick Visual Guide

```
Supabase Dashboard
  └─ [Your Project: nmtwczueujgvopyrfubh]
       └─ SQL Editor (left sidebar)
            └─ New Query
                 └─ [Paste SQL here]
                      └─ Click "Run" button
```

---

## ✅ After Setup

Once the migration is complete:
1. Your database will have all required tables
2. Authentication will work properly
3. You can register teams
4. Admin features will be available

---

**Need help?** If you encounter any errors during the migration, copy the error message and I can help you fix it!
