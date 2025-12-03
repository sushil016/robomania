# 🎯 Multi-Competition Registration System

## 🚀 Quick Setup Guide

### Step 1: Run Database Migration

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy the entire content** from `MIGRATION_MULTI_COMPETITION.sql`
3. **Click "Run"** to create new tables
4. **Run migration function**:
   ```sql
   SELECT migrate_existing_teams();
   ```
5. **Verify** the migration:
   ```sql
   SELECT * FROM team_registrations_view;
   ```

---

## 📊 New Database Structure

### Tables Created:

#### 1. **`bots`** - Reusable Bot Profiles
```sql
- id (UUID, Primary Key)
- user_email (TEXT) - Owner's email
- bot_name (TEXT) - Bot's name
- weight (NUMERIC) - Weight in kg
- dimensions (TEXT) - "L x W x H cm"
- weapon_type (TEXT, nullable) - For combat bots
- description (TEXT, nullable)
- image_url (TEXT, nullable)
- is_weapon_bot (BOOLEAN) - true if has weapons
- created_at, updated_at (TIMESTAMP)
```

#### 2. **`competition_registrations`** - Many-to-Many Relationship
```sql
- id (UUID, Primary Key)
- team_id (UUID, FK to teams)
- competition_type (TEXT) - 'ROBOWARS' | 'ROBORACE' | 'ROBOSOCCER'
- bot_id (UUID, FK to bots, nullable)
- amount (NUMERIC) - Registration fee
- payment_status (TEXT) - 'PENDING' | 'COMPLETED' | 'FAILED'
- payment_id (TEXT) - Razorpay order ID
- payment_date (TIMESTAMP, nullable)
- registration_status (TEXT) - 'PENDING' | 'CONFIRMED' | 'CANCELLED'
- created_at, updated_at (TIMESTAMP)
- UNIQUE(team_id, competition_type)
```

#### 3. **`teams`** - Enhanced
```sql
- (Existing columns remain)
+ is_multi_competition (BOOLEAN)
+ team_locked (BOOLEAN) - Lock team name after first registration
```

---

## 🔧 API Endpoints

### Bot Management

#### **POST `/api/bots/save`**
Save or update a bot profile
```json
{
  "userEmail": "user@example.com",
  "botName": "Destroyer",
  "weight": 7.5,
  "dimensions": "40x40x35 cm",
  "weaponType": "Hammer",
  "description": "Hammer bot for RoboWars",
  "isWeaponBot": true
}
```

#### **GET `/api/bots/list?userEmail=user@example.com`**
Get all bots for a user
```json
{
  "success": true,
  "bots": [...],
  "count": 3
}
```

#### **GET `/api/bots/[id]`**
Get specific bot details

#### **DELETE `/api/bots/[id]`**
Delete a bot (will set bot_id to NULL in registrations)

---

### Registration

#### **POST `/api/create-order`** (UPDATED)
Create payment order for multiple competitions
```json
{
  "teamId": "team-uuid-here",
  "userEmail": "user@example.com",
  "competitions": [
    {
      "competition": "ROBOWARS",
      "amount": 300,
      "botId": "bot-uuid-or-null"
    },
    {
      "competition": "ROBOSOCCER",
      "amount": 200,
      "botId": "another-bot-uuid"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxx",
  "amount": 50000,
  "currency": "INR",
  "key": "rzp_xxx",
  "totalAmount": 500,
  "teamId": "team-uuid",
  "competitions": "ROBOWARS,ROBOSOCCER"
}
```

#### **GET `/api/check-registration?email=user@example.com`** (UPDATED)
Check if user has registered and get all details
```json
{
  "hasRegistered": true,
  "teamId": "team-uuid",
  "teamName": "Robo Warriors",
  "teamLocked": true,
  "paymentStatus": "COMPLETED",
  "registrationStatus": "CONFIRMED",
  "registeredCompetitions": [
    {
      "id": "reg-uuid",
      "competition_type": "ROBOWARS",
      "amount": 300,
      "payment_status": "COMPLETED",
      "registration_status": "CONFIRMED",
      "bot_id": "bot-uuid",
      "bots": {
        "id": "bot-uuid",
        "bot_name": "Destroyer",
        "weight": 7.5,
        "dimensions": "40x40x35 cm",
        "weapon_type": "Hammer",
        "is_weapon_bot": true
      }
    }
  ],
  "savedBots": [...],
  "totalCompetitions": 2
}
```

---

## 💡 Key Features

### 1. **Reusable Bots**
- Users can save bot profiles
- Same bot can be used across multiple competitions
- Example: Non-weapon bot for RoboSoccer can also compete in RoboWars (wedge bot)

### 2. **Team Name Locking**
- After first registration, team name is locked (`team_locked = true`)
- Subsequent registrations auto-fill the locked team name
- Prevents confusion and maintains consistency

### 3. **Per-Competition Payment Status**
- Each competition has its own payment status
- Users can register for multiple competitions with single payment
- Or pay separately for each competition

### 4. **Smart Bot Selection**
- UI shows "Use Existing Bot" option with saved bots
- Or "Create New Bot" to add new profile
- Saves time when registering for multiple competitions

---

## 🎨 User Flow

### New Registration Flow:

```
Step 1: Select Competitions
├─ [✓] RoboWars (₹300)
├─ [✓] RoboSoccer (₹200)
└─ [ ] RoboRace
         ↓
Step 2: Team Details
├─ Team Name: "Robo Warriors" (auto-locked after first save)
├─ Leader Info
└─ Team Members
         ↓
Step 3: Bot Details (for each competition)
├─ RoboWars:
│   ├─ Use Existing Bot: [Dropdown: Destroyer, Speedy, ...]
│   └─ Or Create New Bot
└─ RoboSoccer:
    ├─ Use Existing Bot: [Can reuse Speedy from above]
    └─ Or Create New Bot
         ↓
Step 4: Review & Payment
├─ Team Summary (shown once)
├─ Competition Breakdown:
│   ├─ RoboWars (₹300) - Bot: Destroyer
│   └─ RoboSoccer (₹200) - Bot: Speedy
├─ Total: ₹500
└─ [Pay Now] or [Save as Draft]
```

### Existing User Flow:

```
1. User logs in
2. System detects existing team
3. Team name is PRE-FILLED and LOCKED
4. User selects NEW competitions to add
5. Reuses existing bots or creates new ones
6. Pays only for new competitions
```

---

## 📱 Dashboard View

### New Dashboard Design:

```
┌─────────────────────────────────────────┐
│ Team Information (Shown Once)           │
│ ├─ Team Name: Robo Warriors             │
│ ├─ Institution: MIT                      │
│ ├─ Leader: John Doe                      │
│ └─ Members: 4                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Competition Registrations               │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ RoboWars - CONFIRMED ✅          │    │
│ │ Payment: ₹300 (PAID)            │    │
│ │ Bot: Destroyer (7.5kg, Hammer)  │    │
│ │ Registration Date: Jan 15       │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ RoboSoccer - PENDING ⏳          │    │
│ │ Payment: ₹200 (PENDING)         │    │
│ │ Bot: Speedy (3kg, Non-weapon)   │    │
│ │ [Complete Payment]              │    │
│ └─────────────────────────────────┘    │
│                                         │
│ [+ Add More Competitions]               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ My Bots Library                         │
│ ├─ Destroyer (7.5kg, Combat)            │
│ ├─ Speedy (3kg, Racing)                 │
│ └─ [+ Add New Bot]                      │
└─────────────────────────────────────────┘
```

---

## 🔍 Query Examples

### Get all competitions for a team:
```sql
SELECT * FROM team_registrations_view 
WHERE team_id = 'your-team-uuid';
```

### Get user's saved bots:
```sql
SELECT * FROM bots 
WHERE user_email = 'user@example.com' 
ORDER BY created_at DESC;
```

### Check if competition slot is available:
```sql
SELECT competition_type, COUNT(*) as registrations
FROM competition_registrations
WHERE registration_status = 'CONFIRMED'
GROUP BY competition_type;
```

### Get payment summary:
```sql
SELECT 
  team_id,
  SUM(amount) as total_paid,
  COUNT(*) as competitions_registered,
  STRING_AGG(competition_type, ', ') as competitions
FROM competition_registrations
WHERE payment_status = 'COMPLETED'
GROUP BY team_id;
```

---

## ✅ Fixes Implemented

### 1. **Fixed `/api/create-order` Error**
**Before:** `No teamId provided and isNewTeam is false`
**After:** 
- ✅ Validates `teamId` or `userEmail`
- ✅ Calculates total from `competitions` array
- ✅ Creates competition registrations in DB
- ✅ Proper error messages

### 2. **Enhanced `/api/check-registration`**
**Before:** Only returned `hasRegistered` and `teamId`
**After:**
- ✅ Returns `teamName` (locked)
- ✅ Returns `registeredCompetitions` array with bot details
- ✅ Returns `savedBots` array for reuse
- ✅ Returns per-competition payment status

### 3. **Created Bot Management System**
- ✅ Save bots for reuse
- ✅ List user's bots
- ✅ Get/delete specific bots
- ✅ Link bots to competitions

---

## 🎯 Next Steps

### 1. Run Migration (REQUIRED)
```bash
# Copy MIGRATION_MULTI_COMPETITION.sql to Supabase SQL Editor
# Run it
# Then run: SELECT migrate_existing_teams();
```

### 2. Update Frontend (Coming Next)
- Update `team-register/page.tsx` for multi-competition UI
- Update `dashboard/page.tsx` for grouped view
- Add bot selection components

### 3. Update Payment Verification
- Modify `/api/payment/verify/route.ts`
- Update competition_registrations status on payment success

---

## 🐛 Troubleshooting

### Issue: "Failed to create order"
**Check:**
1. Is `competitions` array provided?
2. Does each competition have `amount` > 0?
3. Does team exist in database?
4. Check server logs for detailed error

### Issue: "Team ID not found"
**Fix:**
1. Use `/api/check-registration?email=xxx` first
2. Get `teamId` from response
3. Pass it to `/api/create-order`

### Issue: Bot not showing in dropdown
**Check:**
1. Is bot saved with correct `user_email`?
2. Query: `SELECT * FROM bots WHERE user_email = 'xxx'`
3. Use `/api/bots/list?userEmail=xxx` to verify

---

## 📞 Support

If you encounter issues:
1. Check server console logs (npm run dev terminal)
2. Check Supabase logs in dashboard
3. Verify tables exist: `bots`, `competition_registrations`
4. Verify view exists: `team_registrations_view`

---

**✨ Your multi-competition system is now ready!** 🚀
