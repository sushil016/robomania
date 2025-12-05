# Critical Fixes Required

## Issues Identified

### 1. ❌ Bot Table Not Being Created
**Problem**: When users register for competitions, the bot data is not being saved to the `bots` table. Only `competition_registrations` is being created with `bot_id` that doesn't exist.

**Root Cause**: In both `/api/create-order` and `/api/phonepe/create-order`, bots are never inserted into the `bots` table before creating competition registrations.

### 2. ❌ Cannot Create Multiple Entries for RoboRace/RoboSoccer
**Problem**: Users cannot create multiple entries for RoboRace and RoboSoccer with same or different bots.

**Root Cause**: In `/api/create-order` line 177, there's a check that updates existing registration instead of creating new one:
```typescript
const { data: existingReg } = await supabaseAdmin
  .from('competition_registrations')
  .select('id')
  .eq('team_id', finalTeamId)
  .eq('competition_type', comp.competition.toUpperCase())
  .single()

if (existingReg) {
  // Updates instead of creating new entry
  await supabaseAdmin.from('competition_registrations').update(...)
}
```

This logic prevents multiple entries per competition type.

### 3. ❌ Deployed URL Create Order Issue
**Problem**: Cannot create order on deployed Vercel URL.

**Possible Causes**:
- Environment variables not set in Vercel
- Razorpay/PhonePe credentials missing
- Database connection issues
- CORS or URL configuration problems

## Required Fixes

### Fix 1: Create Bots in Database
Both order creation APIs need to:
1. Insert bot data into `bots` table first
2. Get the returned bot ID
3. Use that bot ID in `competition_registrations`

### Fix 2: Allow Multiple Entries for RoboRace/RoboSoccer
Need to differentiate between:
- **RoboWars**: Check for existing + same bot → Prevent duplicate
- **RoboRace/RoboSoccer**: Always create new entry (allow multiple)

### Fix 3: Check Vercel Environment Variables
Required environment variables for Vercel deployment:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `PHONEPE_MERCHANT_ID`
- `PHONEPE_SALT_KEY`
- `PHONEPE_SALT_INDEX`
- `NEXT_PUBLIC_APP_URL` (must be https://robomania-teal.vercel.app)
- All Supabase credentials

## Competition Entry Rules (Clarification)

### RoboWars ⚔️
- **One entry per team per bot**
- User can have multiple entries ONLY if using different bots
- Same bot cannot be used in multiple RoboWars entries
- Team A with Bot 1 → Entry 1 ✅
- Team A with Bot 2 → Entry 2 ✅
- Team A with Bot 1 again → ❌ Duplicate

### RoboRace 🏁 & RoboSoccer ⚽
- **Multiple entries allowed**
- Can use same bot for multiple entries
- Can use different bots for multiple entries
- Team A with Bot 1 → Entry 1 ✅
- Team A with Bot 1 → Entry 2 ✅
- Team A with Bot 2 → Entry 3 ✅
- All allowed!

## Implementation Plan

1. ✅ Update `/api/create-order/route.ts` to create bots
2. ✅ Update `/api/phonepe/create-order/route.ts` to create bots
3. ✅ Modify duplicate check logic for RoboWars only
4. ✅ Add proper entry validation
5. ✅ Test locally
6. ✅ Verify Vercel environment variables
7. ✅ Deploy and test

## Files to Modify

1. `src/app/api/create-order/route.ts`
2. `src/app/api/phonepe/create-order/route.ts`
3. Environment variables on Vercel dashboard
