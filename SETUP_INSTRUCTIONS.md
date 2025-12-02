# 🚨 URGENT: Fix Authentication Error

## Error: "Invalid API key"

Your `.env` file has been created, but you need to add your **Supabase Service Role Key**.

## Steps to Fix:

### 1. Get Your Supabase Service Role Key

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project: `nmtwczueujgvopyrfubh`
3. Go to **Project Settings** (gear icon in sidebar)
4. Click on **API** in the left menu
5. Under **Project API keys**, find the **`service_role`** key (secret)
6. Copy the full key

### 2. Update Your .env File

Open `/Users/sushilsahani/devsushil/robomania/.env` and replace this line:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

With your actual service role key:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS... (your full key)
```

### 3. Restart Your Development Server

After updating the `.env` file:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign In"
3. Sign in with Google
4. You should now be able to authenticate successfully!

---

## Current .env Status

✅ `NEXT_PUBLIC_SUPABASE_URL` - Configured
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configured
❌ `SUPABASE_SERVICE_ROLE_KEY` - **NEEDS TO BE UPDATED**
✅ `GOOGLE_CLIENT_ID` - Configured
✅ `GOOGLE_CLIENT_SECRET` - Configured
✅ `NEXTAUTH_URL` - Configured
✅ `NEXTAUTH_SECRET` - Configured
✅ `ADMIN_EMAIL` - Configured

## Why This Happened

The `.env` file was missing from your project. I created it from `.env.example`, but the `SUPABASE_SERVICE_ROLE_KEY` is a secret key that must be obtained from your Supabase dashboard and cannot be stored in version control.

## Security Note

⚠️ **NEVER commit your `.env` file to Git!** It contains secret keys.
The `.env` file is already in `.gitignore`.
