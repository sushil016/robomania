# Fix: Different Bots Not Showing Per Competition

## Problem
All competitions are showing the same bot ("Nox") even though different bots were entered for each competition.

### Root Cause
The `bots` table doesn't exist in the database. The error log shows:
```
Error fetching bots: {
  code: '42703',
  message: 'column bots.team_id does not exist'
}
```

This causes:
1. Bot creation fails silently in `/api/create-order`
2. `bot_id` remains `null` in `competition_registrations`
3. System falls back to `teams` table which only has ONE bot
4. All competitions show the same fallback bot

---

## Solution: Run Database Migration

### Step 1: Apply the Migration

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `/supabase/migrations/004_add_bots_table.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter` (Cmd+Enter on Mac)
7. Verify success message appears

**Option B: Using Supabase CLI**

```bash
# If you have Supabase CLI installed
supabase db push

# OR manually apply the migration
supabase db execute -f supabase/migrations/004_add_bots_table.sql
```

---

### Step 2: Verify Migration Success

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if bots table exists
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'bots'
ORDER BY ordinal_position;

-- Check bot_id column in competition_registrations
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'competition_registrations' 
  AND column_name = 'bot_id';
```

Expected results:
- `bots` table should have columns: `id`, `team_id`, `bot_name`, `weight`, `dimensions`, `weapon_type`, `is_weapon_bot`
- `competition_registrations` should have a `bot_id` column (UUID, nullable)

---

### Step 3: Test New Registration

After migration:

1. Register for a new competition with a unique bot name
2. Check the dashboard - bot details should now be specific per competition
3. Verify in Supabase table editor:
   - `bots` table should have entries
   - `competition_registrations.bot_id` should reference `bots.id`

---

## What the Migration Does

### Creates `bots` Table
```sql
CREATE TABLE public.bots (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),  -- Links bot to team
  bot_name TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  dimensions TEXT NOT NULL,
  weapon_type TEXT,
  is_weapon_bot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Updates `competition_registrations` Table
- Adds `bot_id` column to link each competition entry to a specific bot
- Renames columns to match code expectations:
  - `competition` → `competition_type`
  - `status` → `registration_status`
- Removes unique constraint (allows multiple entries per competition)

### Adds Proper Indexes
- `idx_bots_team_id` - Fast lookups by team
- `idx_bots_bot_name` - Search by bot name
- `idx_comp_reg_bot_id` - Link competitions to bots

---

## How It Fixes the Issue

### Before (Broken)
```
Competition 1 → bot_id: null → Fallback to teams.robot_name ("Nox")
Competition 2 → bot_id: null → Fallback to teams.robot_name ("Nox")
Competition 3 → bot_id: null → Fallback to teams.robot_name ("Nox")
```

### After (Fixed)
```
Competition 1 → bot_id: abc123 → bots.bot_name ("Destroyer")
Competition 2 → bot_id: def456 → bots.bot_name ("Racer")
Competition 3 → bot_id: ghi789 → bots.bot_name ("Nox")
```

---

## Future Registrations

After the migration, when users register for competitions:

1. **Bot Creation**: Each robot is saved in the `bots` table
2. **Bot Linking**: `competition_registrations.bot_id` references the specific bot
3. **Bot Display**: Dashboard shows the correct bot for each competition
4. **Bot Reuse**: Same bot can be used across multiple competitions (if allowed by rules)

---

## For Existing Registrations

**Note**: Existing registrations with `bot_id: null` will continue to show the fallback bot from the `teams` table until:

1. User re-registers or updates their registration
2. OR you manually migrate existing data:

```sql
-- Optional: Migrate existing robot data to bots table
-- (Run this AFTER the main migration)

WITH bot_inserts AS (
  INSERT INTO bots (team_id, bot_name, weight, dimensions, weapon_type, is_weapon_bot)
  SELECT 
    team_id,
    COALESCE(robot_name, 'Bot'),
    COALESCE(robot_weight, 5),
    COALESCE(robot_dimensions, '30x30x30'),
    weapon_type,
    (weapon_type IS NOT NULL AND weapon_type != '')
  FROM competition_registrations
  WHERE bot_id IS NULL 
    AND robot_name IS NOT NULL
  ON CONFLICT DO NOTHING
  RETURNING id, team_id, bot_name
)
UPDATE competition_registrations cr
SET bot_id = bi.id
FROM bot_inserts bi
WHERE cr.team_id = bi.team_id 
  AND cr.robot_name = bi.bot_name
  AND cr.bot_id IS NULL;
```

---

## Troubleshooting

### If migration fails with "column already exists"
The database may already have some of these changes. Run this to check:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'competition_registrations';
```

### If you see "relation bots does not exist" in logs
The migration hasn't been applied yet. Follow Step 1 above.

### If bots still show as the same
1. Clear browser cache
2. Check Supabase table editor - verify `bot_id` is populated
3. Re-register for a new test competition

---

## Summary

✅ **Run the migration**: `/supabase/migrations/004_add_bots_table.sql`  
✅ **Verify success**: Check `bots` table exists  
✅ **Test registration**: Create new competition entry  
✅ **Confirm fix**: Each competition shows its unique bot  

After migration, the "different bots showing same" issue will be resolved! 🎉
