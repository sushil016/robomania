# 🐛 Bug Fixes: Registration Check & Payment Status

## Issues Identified

### 1. **GET /api/check-registration returning 400 - "Team ID not found"**
**Problem**: API was only checking `user_email` field, but your team has email in `contact_email` field.

**Root Cause**:
```typescript
// Old code - only checked user_email
.eq('user_email', email)
```

**Solution**: Updated to check both fields:
```typescript
// New code - checks both user_email and contact_email
.or(`user_email.eq.${email},contact_email.eq.${email}`)
```

### 2. **Payment Status COMPLETED but Team Status still PENDING**
**Problem**: Your team shows:
- `payment_status: 'COMPLETED'` ✅
- `payment_id: 'order_RmiHODfUZn109r'` ✅
- `payment_date: '2025-12-02T10:41:29.167+00:00'` ✅
- BUT `status: 'PENDING'` ❌ (should be 'CONFIRMED')

**Root Cause**: Team was created before payment verification updated the status field.

**Solution**: Created migration API to fix existing teams.

### 3. **POST /api/create-order returning 400**
**Problem**: "Team ID not found" when trying to make payment.

**Root Cause**: API wasn't handling cases where teamId might be missing or needed to search by email.

**Solution**: Added better error logging and fallback to search by email.

---

## Files Modified

### 1. `/src/app/api/check-registration/route.ts`
**Changes**:
- ✅ Now checks both `user_email` AND `contact_email`
- ✅ Returns `teamId` in response
- ✅ Returns `paymentStatus` in response
- ✅ Added console logging for debugging
- ✅ Better error handling

**Before**:
```typescript
const { data: team, error } = await supabaseAdmin
  .from('teams')
  .select('id')
  .eq('user_email', email)
  .single()

return NextResponse.json({
  hasRegistered: !!team
})
```

**After**:
```typescript
const { data: teams, error } = await supabaseAdmin
  .from('teams')
  .select('id, user_email, contact_email, payment_status, status')
  .or(`user_email.eq.${email},contact_email.eq.${email}`)

return NextResponse.json({
  hasRegistered: teams && teams.length > 0,
  teamId: teams && teams.length > 0 ? teams[0].id : null,
  paymentStatus: teams && teams.length > 0 ? teams[0].payment_status : null
})
```

### 2. `/src/app/api/create-order/route.ts`
**Changes**:
- ✅ Added detailed console logging
- ✅ Better error messages
- ✅ Fallback to search by email if no teamId
- ✅ Handles both `user_email` and `contact_email`

**New Logic**:
```typescript
if (teamId) {
  // Try by teamId first
  console.log('Fetching team with ID:', teamId)
  // ... fetch team
} else if (userEmail) {
  // Fallback to email search
  console.log('No teamId, searching by email:', userEmail)
  const { data: teams } = await supabaseAdmin
    .from('teams')
    .select('*')
    .or(`user_email.eq.${userEmail},contact_email.eq.${userEmail}`)
    .order('created_at', { ascending: false })
    .limit(1)
}
```

### 3. `/src/app/api/admin/fix-team-status/route.ts` (NEW)
**Purpose**: One-time migration script to fix existing teams

**What it does**:
1. Finds all teams with `payment_status: 'COMPLETED'` but `status != 'CONFIRMED'`
2. Updates their status to `'CONFIRMED'`
3. Returns count of fixed teams

**How to use**:
```bash
# Option 1: Using curl
curl -X POST http://localhost:3000/api/admin/fix-team-status

# Option 2: Just visit in browser (GET also works)
http://localhost:3000/api/admin/fix-team-status
```

---

## How to Fix Your Current Issue

### Step 1: Run the Migration Script

Visit this URL in your browser while dev server is running:
```
http://localhost:3000/api/admin/fix-team-status
```

Expected response:
```json
{
  "success": true,
  "message": "Fixed 1 teams",
  "count": 1,
  "teams": [
    {
      "id": "c21605a0-f561-4d3a-8652-7367317c3798",
      "team_name": "lumadev",
      "status": "CONFIRMED",
      "payment_status": "COMPLETED"
    }
  ]
}
```

### Step 2: Refresh Your Pages

After running the migration:
1. Refresh `/team-register` - Should now show "Team already registered"
2. Refresh `/dashboard` - Should show "CONFIRMED" status
3. Try creating a new order - Should work now

---

## Expected Behavior After Fixes

### Registration Check:
✅ **Before**: `GET /api/check-registration?email=sahanisushil325@gmail.com` → 400 error
✅ **After**: Returns:
```json
{
  "hasRegistered": true,
  "teamId": "c21605a0-f561-4d3a-8652-7367317c3798",
  "paymentStatus": "COMPLETED"
}
```

### Team Status:
✅ **Before**: `status: 'PENDING'` despite completed payment
✅ **After**: `status: 'CONFIRMED'`

### Create Order:
✅ **Before**: `POST /api/create-order` → 400 "Team ID not found"
✅ **After**: Successfully creates order or detects existing registration

---

## Database Schema Context

Your team data structure:
```javascript
{
  id: 'c21605a0-f561-4d3a-8652-7367317c3798',
  user_email: 'sahanisushil325@gmail.com',  // ← Was checking this
  contact_email: 'sahanisushil325@gmail.com', // ← Now also checks this
  team_name: 'lumadev',
  institution: 'Bvcoe',
  payment_status: 'COMPLETED', // ✅ Correct
  payment_id: 'order_RmiHODfUZn109r', // ✅ Correct
  payment_date: '2025-12-02T10:41:29.167+00:00', // ✅ Correct
  status: 'PENDING' // ❌ Should be 'CONFIRMED' - FIXED by migration
}
```

---

## Status Values Explained

### Payment Status:
- `PENDING` - No payment made yet
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed

### Team Status:
- `PENDING` - Team created, waiting for payment
- `CONFIRMED` - Payment completed, registration confirmed
- `APPROVED` - (Legacy) Same as CONFIRMED
- `REJECTED` - Admin rejected the team

**The Fix**: When `payment_status: 'COMPLETED'`, the `status` should automatically become `'CONFIRMED'`.

---

## Testing the Fixes

### Test 1: Check Registration API
```bash
curl "http://localhost:3000/api/check-registration?email=sahanisushil325@gmail.com"
```

Expected:
```json
{
  "hasRegistered": true,
  "teamId": "c21605a0-f561-4d3a-8652-7367317c3798",
  "paymentStatus": "COMPLETED"
}
```

### Test 2: Team Details API
```bash
curl "http://localhost:3000/api/team-details"
```

Should return team with `status: 'CONFIRMED'`

### Test 3: Dashboard Page
Visit: `http://localhost:3000/dashboard`

Should show:
- ✅ Payment Status: COMPLETED
- ✅ Registration Status: CONFIRMED (not PENDING)
- ✅ No "Complete Payment" banner

### Test 4: Registration Page
Visit: `http://localhost:3000/team-register`

Should show:
- ✅ "You've already registered" message
- ✅ Link to dashboard or team details

---

## Prevention for Future

### In Payment Verification Flow:
The `/api/payment/verify` route now correctly sets:
```typescript
{
  payment_status: 'COMPLETED',
  status: 'CONFIRMED', // ← This is key
  payment_id: paymentId,
  payment_date: new Date().toISOString()
}
```

### In Registration Flow:
New teams will automatically get correct status after payment.

---

## Summary

### What was wrong:
1. ❌ API only checked `user_email`, not `contact_email`
2. ❌ Existing team had completed payment but status was still PENDING
3. ❌ Create order API couldn't find teams properly

### What's fixed:
1. ✅ API now checks both email fields
2. ✅ Migration script created to fix existing teams
3. ✅ Better error handling and logging throughout
4. ✅ Fallback logic to find teams by email

### Action Required:
**Run the migration once**:
```
http://localhost:3000/api/admin/fix-team-status
```

After that, everything should work perfectly! 🎉

---

## Logs to Watch For

After the fix, you should see:
```
✓ GET /api/check-registration 200 in 25ms
✓ GET /api/team-details 200 in 400ms
✓ Team status: CONFIRMED
✓ Payment status: COMPLETED
```

Instead of:
```
✗ GET /api/check-registration 400 in 28ms
✗ POST /api/create-order 400 in 267ms
```
