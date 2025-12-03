# 🚀 Database Migration Guide

## Problem
You're getting this error:
```
column teams.team_locked does not exist
```

This is because the new multi-competition database schema hasn't been applied yet.

---

## ✅ Solution: Run the Migration SQL

### **Step 1: Open Supabase Dashboard**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your **RoboMania** project

---

### **Step 2: Open SQL Editor**

1. On the left sidebar, click on **"SQL Editor"** (icon looks like `</>`)
2. Click **"New Query"** button (top right)

---

### **Step 3: Copy the Migration SQL**

1. Open the file: `MIGRATION_MULTI_COMPETITION.sql` in your project root
2. **Copy ALL the contents** (185 lines total)
3. **Paste** into the SQL Editor in Supabase

---

### **Step 4: Run the Migration**

1. Click the **"Run"** button (or press `Cmd + Enter` on Mac / `Ctrl + Enter` on Windows)
2. Wait for it to complete (should take 2-5 seconds)
3. You should see: ✅ **"Success. No rows returned"**

---

### **Step 5: Run the Migration Function**

After the main SQL runs successfully, run this command in a **NEW query**:

```sql
SELECT migrate_existing_teams();
```

This will:
- Migrate your existing team registrations
- Create competition_registrations entries for existing teams
- Set the `is_multi_competition` flag

---

### **Step 6: Verify the Migration**

Run this query to verify everything worked:

```sql
-- Check new tables exist
SELECT COUNT(*) as bots_count FROM bots;
SELECT COUNT(*) as comp_reg_count FROM competition_registrations;

-- Check new columns exist
SELECT id, team_name, team_locked, is_multi_competition 
FROM teams 
LIMIT 5;

-- Check the view
SELECT * FROM team_registrations_view LIMIT 5;
```

You should see results without errors!

---

## 🎯 What This Migration Does

### **Creates 2 New Tables:**

1. **`bots`** - Stores reusable bot profiles
   - Users can save multiple bots
   - Bots can be reused across competitions

2. **`competition_registrations`** - Many-to-many relationship
   - Links teams to competitions
   - Each entry has its own payment status
   - One team can register for multiple competitions

### **Adds New Columns to `teams` Table:**

- `team_locked` - Prevents team name changes after first registration
- `is_multi_competition` - Marks teams using the new system

### **Creates a View:**

- `team_registrations_view` - Pre-joined view for easy querying

---

## 🔍 Troubleshooting

### If you get "relation already exists" errors:
✅ **This is OK!** It means some tables already exist. The migration uses `IF NOT EXISTS` to be safe.

### If you get "column already exists" errors:
✅ **This is OK!** The migration uses `ADD COLUMN IF NOT EXISTS` to be safe.

### If you get foreign key constraint errors:
⚠️ This means your `teams` table structure is different. Check:
```sql
\d teams -- Show teams table structure
```

### If migration fails completely:
1. Check you have the correct Supabase project selected
2. Verify you have admin/owner permissions
3. Copy the error message and check the SQL line number

---

## 🧪 Test After Migration

Once migration is complete, test in your app:

1. **Refresh your browser** (clear cache: `Cmd + Shift + R` or `Ctrl + Shift + F5`)
2. Try registering with: `sushilsahani322@gmail.com`
3. The error `column teams.team_locked does not exist` should be **GONE**
4. You should see the premium dashboard working!

---

## 📊 Expected Results

After successful migration:

### Before Migration:
```
❌ GET /api/check-registration?email=... 500
❌ Error: column teams.team_locked does not exist
```

### After Migration:
```
✅ GET /api/check-registration?email=... 200
✅ Returns: { hasRegistered: true, teamId: "...", teamLocked: false, ... }
```

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Supabase Logs**: Dashboard → Logs → Select time range
2. **Verify Table Structure**: Run `\d teams` in SQL Editor
3. **Check Permissions**: Ensure you're the project owner
4. **Rollback if needed**: The migration is mostly additive (doesn't delete data)

---

## 📝 Quick Command Reference

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bots', 'competition_registrations');

-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'teams' 
AND column_name IN ('team_locked', 'is_multi_competition');

-- Count existing data
SELECT 
  (SELECT COUNT(*) FROM teams) as teams,
  (SELECT COUNT(*) FROM bots) as bots,
  (SELECT COUNT(*) FROM competition_registrations) as registrations;
```

---

## ✨ After Migration Success

Your app will now support:
- ✅ Multiple competitions per team
- ✅ Reusable bot profiles
- ✅ Per-competition payment tracking
- ✅ Team name locking
- ✅ Premium dashboard with all competition details

**Go run the migration now!** 🚀
