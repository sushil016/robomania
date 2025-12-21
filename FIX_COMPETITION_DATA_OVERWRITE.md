# Fix: Team Members and Bot Info Overwriting Across Competitions

## Problem Description

When registering for multiple competitions:
1. Register for **RoboWars** with Team A, Bot "Destroyer", Members [Alice, Bob]
2. Register for **RoboRace** with Team A, Bot "Racer", Members [Charlie, Diana]
3. **Result**: RoboWars now shows Bot "Racer" and Members [Charlie, Diana] ❌

### Root Cause

The current architecture has:
- **ONE** `teams` table row per user/team
- **ONE** set of team members in `team_members` table per team
- Team/member/bot data stored in `teams` table (shared across all competitions)

When you register for a new competition, `/api/register` **UPDATES** the entire team record, overwriting:
- Team leader info
- Team members
- Bot specifications

This affects ALL competitions using that team.

---

## Solution Architecture

### Database Schema Changes

#### 1. Bots Table (Already Created)
```sql
CREATE TABLE bots (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL,
  bot_name TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  dimensions TEXT NOT NULL,
  weapon_type TEXT,
  is_weapon_bot BOOLEAN
);
```
✅ Each competition registration links to a specific bot via `bot_id`

#### 2. Team Members Per Competition
```sql
ALTER TABLE team_members 
ADD COLUMN competition_registration_id UUID;
```
✅ Team members are now linked to specific competition registrations

#### 3. Competition Registrations
```sql
competition_registrations (
  id UUID PRIMARY KEY,
  team_id UUID,          -- Which team
  competition_type TEXT, -- Which competition
  bot_id UUID,           -- Which bot for THIS competition
  -- Bot id references bots.id
  -- Team members reference this id in competition_registration_id
)
```

---

## Implementation Steps

### Step 1: Run Database Migrations

**In Supabase SQL Editor, run these in order:**

1. **`004_add_bots_table_simple.sql`** - Creates bots table
2. **`005_add_competition_members.sql`** - Adds competition_registration_id to team_members

### Step 2: Code Changes Already Applied

✅ **`/api/register/route.ts`** - Modified to NOT update existing teams
- When team exists: Just return existing team
- Doesn't overwrite team data anymore

### Step 3: Update Create Order Logic

The `/api/create-order` route needs to:
1. Create bots in `bots` table (already does this)
2. Link `bot_id` to `competition_registrations` (already does this)
3. **NEW**: Save team members with `competition_registration_id`

---

## What's Fixed vs What Needs Fixing

### ✅ Fixed
1. `/api/register` no longer updates existing teams
2. `bots` table schema created
3. Database ready for competition-specific team members

### ⚠️ Needs Manual Migration
Run the SQL migrations in Supabase:
- `004_add_bots_table_simple.sql`
- `005_add_competition_members.sql`

### 🔨 Still To Fix
Update `/api/create-order` to save team members per competition (see code below)

---

## Code Changes Needed in `/api/create-order/route.ts`

After creating the competition registration, add this code:

```typescript
// After creating competition_registrations entry
for (const comp of competitionsArray) {
  // ... existing bot creation code ...
  
  // Create competition registration
  const { data: compReg, error: compRegError } = await supabaseAdmin
    .from('competition_registrations')
    .insert({ 
      team_id: finalTeamId, 
      competition_type: competitionType, 
      bot_id: botIdToUse, 
      amount: comp.amount, 
      payment_id: order.id, 
      payment_status: 'PENDING', 
      registration_status: 'PENDING' 
    })
    .select('id')
    .single()
  
  if (compReg && teamData?.teamMembers) {
    // Save team members for THIS competition registration
    const membersToInsert = teamData.teamMembers
      .filter(m => m.name && m.email)
      .map(member => ({
        team_id: finalTeamId,
        competition_registration_id: compReg.id,  // ⭐ Link to this specific competition
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        role: member.role || 'Member'
      }))
    
    if (membersToInsert.length > 0) {
      await supabaseAdmin
        .from('team_members')
        .insert(membersToInsert)
      
      console.log(`✅ Saved ${membersToInsert.length} team members for ${comp.competition}`)
    }
  }
}
```

---

## Testing Plan

### Test Case 1: New User, Multiple Competitions
1. Register for RoboWars with Bot "Destroyer", Members [Alice, Bob]
2. Register for RoboRace with Bot "Racer", Members [Charlie, Diana]  
3. Check dashboard:
   - ✅ RoboWars shows Bot "Destroyer", Members [Alice, Bob]
   - ✅ RoboRace shows Bot "Racer", Members [Charlie, Diana]

### Test Case 2: Existing User, Add New Competition
1. User already registered for RoboWars
2. Register for RoboSoccer with different bot and members
3. Check dashboard:
   - ✅ RoboWars data unchanged
   - ✅ RoboSoccer shows new bot and members

### Test Case 3: Same Bot, Different Competitions
1. Register for RoboRace with Bot "Speedster"
2. Register for RoboSoccer with Bot "Speedster" (same bot)
3. Both competitions should reference the same bot_id

---

## Migration Timeline

1. **Run SQL migrations** (5 minutes)
   - Execute `004_add_bots_table_simple.sql`
   - Execute `005_add_competition_members.sql`

2. **Update `/api/create-order`** (15 minutes)
   - Add team members saving logic
   - Test with new registrations

3. **Test existing data** (10 minutes)
   - Check existing registrations still display
   - Verify fallback to teams table still works

4. **New registrations** (5 minutes)
   - Register for a new competition
   - Verify data stays separate

---

## Rollback Plan

If something breaks:

1. **Database**: Migrations are additive (ADD COLUMN), won't break existing data
2. **Code**: `/api/register` change is safe (just returns early instead of updating)
3. **Worst case**: Revert `/api/register` change, re-add update logic

---

## Current Status

✅ **Diagnosis**: Complete - identified the issue  
✅ **Solution designed**: Database schema + code changes mapped  
✅ **Migrations created**: `004_add_bots_table_simple.sql`, `005_add_competition_members.sql`  
✅ **API updated**: `/api/register` no longer overwrites teams  

⏳ **Remaining**: 
1. Run migrations in Supabase
2. Update `/api/create-order` to save competition-specific team members
3. Test with new registrations

---

## Next Steps for You

1. **Run Migrations in Supabase SQL Editor**:
   ```sql
   -- Copy and run 004_add_bots_table_simple.sql
   -- Then copy and run 005_add_competition_members.sql
   ```

2. **Let me know when migrations are done**
   I'll then update the `/api/create-order` route to save team members per competition

3. **Test**
   Try registering for a new competition and verify data stays separate

Would you like me to update the `/api/create-order` route now, or wait until you've run the migrations?
