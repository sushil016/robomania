# 🔧 FIX: Authentication Profile Error

## Error: "null value in column 'id' of relation 'profiles' violates not-null constraint"

The profiles table was configured to work with Supabase Auth, but you're using NextAuth with Google OAuth. I've created a fix!

---

## 🚀 Quick Fix Steps

### Step 1: Run the Fix SQL in Supabase

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/nmtwczueujgvopyrfubh/sql)
2. Click **New Query**
3. Copy and paste the **entire content** from:
   ```
   /Users/sushilsahani/devsushil/robomania/supabase/migrations/002_fix_profiles_for_nextauth.sql
   ```
4. Click **Run** (or Cmd+Enter)
5. ✅ You should see "Success. No rows returned"

### Step 2: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 3: Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign In" 
3. Sign in with Google
4. ✅ **You should now be successfully authenticated!**

---

## 📝 What This Fix Does

### Changes to Profiles Table:
- ✅ **Auto-generates UUIDs** for new profiles (no longer depends on auth.users)
- ✅ **Email is now the primary identifier** (unique constraint)
- ✅ **Works with NextAuth** Google OAuth
- ✅ **Updated RLS policies** to work with service role

### Changes to Auth Logic:
- ✅ Retrieves the generated ID after profile creation
- ✅ Stores the ID in the user session
- ✅ Handles both new and existing users properly

---

## 🔍 Verify It Worked

After signing in, check your Supabase dashboard:

1. Go to **Table Editor**
2. Select **profiles** table
3. You should see your profile with:
   - ✅ Auto-generated UUID id
   - ✅ Your name
   - ✅ Your email
   - ✅ Your Google profile image
   - ✅ Timestamps

---

## ⚠️ Troubleshooting

### If you get "table already exists" error:
The fix script handles this with `DROP TABLE IF EXISTS`, so it should work fine.

### If authentication still fails:
1. Clear your browser cookies for localhost:3000
2. Restart the dev server
3. Try signing in again

### If you see other errors:
Copy the error message and I can help fix it!

---

## 🎉 Next Steps

Once authentication works:
- ✅ User profiles will be automatically created
- ✅ You can register teams
- ✅ Admin features will work
- ✅ All API routes will have access to user data

---

**The fix is ready! Just run the SQL script and restart your server.** 🚀
