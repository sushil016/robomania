# PhonePe Payment & Bot Display Fixes

## Issues Fixed

### 1. ✅ Automatic Payment Verification
**Problem**: Users had to manually verify PhonePe payments after successful payment.

**Root Cause**: PhonePe callback wasn't receiving the `merchantOrderId` parameter in the redirect URL.

**Solution**: Added `merchantOrderId` as a query parameter in the redirect URL:

#### Files Modified:

**`/src/app/api/phonepe/create-order/route.ts`**
```typescript
// OLD - No merchant order ID in callback
const redirectUrl = `${baseUrl}/api/phonepe/payment-callback`

// NEW - Includes merchant order ID
const redirectUrl = `${baseUrl}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
```

**`/src/app/api/phonepe/initiate-payment/route.ts`**
```typescript
// OLD
const redirectUrl = `${baseUrl}/api/phonepe/payment-callback`

// NEW
const redirectUrl = `${baseUrl}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
```

**Flow Now**:
```
User Pays → PhonePe redirects with merchantOrderId 
→ Callback receives order ID 
→ Checks payment status automatically 
→ Updates database if COMPLETED 
→ Redirects to /dashboard?payment=success
```

**Result**: ✨ Payment is now verified **instantly** after completion - no manual verification needed!

---

### 2. ✅ Bot Data Showing NULL
**Problem**: Bot details showing as `null` even though robot data exists in the database.

**Root Cause**: 
- New `competition_registrations` table uses `bot_id` foreign key to `bots` table
- When registrations are created without assigning specific bots, `bot_id = null`
- Old registrations have robot data stored directly in `teams` table
- SQL join returns `null` when `bot_id` is null

**Solution**: Added fallback logic to fetch bot data from `teams` table when `bot_id` is null.

#### File Modified:

**`/src/app/api/check-registration/route.ts`**

Added fallback bot data retrieval:

```typescript
// After fetching competition registrations
const hasNullBots = registeredCompetitions.some(
  c => c.bot_id === null && c.bots === null
)

if (hasNullBots) {
  // Fetch robot data from teams table
  const { data: fullTeam } = await supabaseAdmin
    .from('teams')
    .select('robot_name, robot_weight, robot_dimensions, weapon_type')
    .eq('id', team.id)
    .single()

  if (fullTeam && fullTeam.robot_name) {
    // Create fallback bot object
    const fallbackBotData = {
      id: null,
      bot_name: fullTeam.robot_name,
      weight: fullTeam.robot_weight,
      dimensions: fullTeam.robot_dimensions,
      weapon_type: fullTeam.weapon_type,
      is_weapon_bot: !!fullTeam.weapon_type
    }
    
    // Apply to competitions without bots
    registeredCompetitions = registeredCompetitions.map(comp => {
      if (comp.bot_id === null && comp.bots === null) {
        return { ...comp, bots: fallbackBotData }
      }
      return comp
    })
  }
}
```

**Result**: ✨ Bot details now display correctly even for registrations without assigned bot_id!

---

## Technical Details

### Payment Callback Flow

**Before Fix**:
```
PhonePe → Redirect to /api/phonepe/payment-callback
                ↓
          No merchantOrderId
                ↓
     Redirect to dashboard?payment=pending
                ↓
     User must click "Verify Payment"
```

**After Fix**:
```
PhonePe → Redirect to /api/phonepe/payment-callback?merchantOrderId=ROBOMANIA_xxx
                ↓
     Extract merchantOrderId from URL params
                ↓
     Call phonepeClient.getOrderStatus(merchantOrderId)
                ↓
     Update database if status = COMPLETED
                ↓
     Redirect to dashboard?payment=success
                ↓
     ✅ Payment automatically verified!
```

### Bot Data Fallback Logic

**Database Structure**:
```
teams table:
  - robot_name
  - robot_weight  
  - robot_dimensions
  - weapon_type

competition_registrations table:
  - bot_id (FK to bots table)
  
bots table:
  - id
  - bot_name
  - weight
  - dimensions
  - weapon_type
```

**Query Strategy**:
1. First, fetch competition registrations with LEFT JOIN to bots
2. Check if any have `bot_id = null` AND `bots = null`
3. If yes, query teams table for robot data
4. Apply robot data from teams table to competitions without bots
5. Return enriched data

**Result**: Works with both old (teams table) and new (bots table) data structures!

---

## Testing Instructions

### Test 1: Automatic Payment Verification
1. Go to dashboard
2. Select a pending competition
3. Click "PhonePe" button
4. Complete payment on PhonePe
5. **Expected**: Automatically redirected to dashboard with "Payment successful" message
6. **Expected**: Registration status changes to "COMPLETED" instantly

### Test 2: Bot Data Display
1. Go to dashboard
2. View registered competitions
3. **Expected**: Bot details show correctly:
   - Bot name
   - Weight
   - Dimensions
   - Weapon type (if applicable)
4. **Expected**: No "null" values displayed

---

## API Changes Summary

### Modified Endpoints

| Endpoint | Change | Purpose |
|----------|--------|---------|
| `/api/phonepe/create-order` | Add merchantOrderId to redirect URL | Enable automatic verification |
| `/api/phonepe/initiate-payment` | Add merchantOrderId to redirect URL | Enable automatic verification |
| `/api/check-registration` | Add bot fallback logic | Fix null bot data |

### No Breaking Changes
- All existing APIs continue to work
- Razorpay flow unchanged
- Backward compatible with old database structure

---

## Logs to Verify Fixes

### Successful Payment Flow:
```
✅ PhonePe order created: ROBOMANIA_8a9f5657_77fad283
✅ PhonePe payment initiated
PhonePe GET callback received with params: merchantOrderId=ROBOMANIA_8a9f5657_77fad283
Checking order status for: ROBOMANIA_8a9f5657_77fad283
Order status: COMPLETED
✅ Database updated for completed payment
✅ Updated team 8a9f5657-5e35-4852-8ea6-ddf1c8c1ea88
```

### Bot Data Fallback:
```
Using new format, competitions: [...]
Some competitions have null bots, fetching from teams table as fallback
Found bot data in teams table: {
  robot_name: 'Rotor Bot',
  robot_weight: 5,
  robot_dimensions: '30x30x30',
  weapon_type: 'Hammer'
}
Applied fallback bot data to competitions
```

---

## Benefits

1. **Better UX**: No manual verification needed
2. **Instant Feedback**: Payment status updates immediately
3. **Data Consistency**: Bot details always visible
4. **Backward Compatible**: Works with old and new data
5. **Reduced Support**: Fewer "payment not updating" tickets

---

## Build Status

✅ Build successful  
✅ No TypeScript errors  
✅ All routes compile correctly  

**Note**: PhonePe SDK client initialization warnings during build are expected and don't affect runtime.

---

**Last Updated**: January 2025  
**Version**: 1.2.0
