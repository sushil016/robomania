# Bot Details Debugging Guide

## 🔍 How to Debug "No Bot Assigned" Issue

### Step 1: Check Terminal Logs

Since you're running `npm run dev`, look at your **terminal** for these console logs:

```
Check registration for: sushilsahani322@gmail.com
Competition query result: { ... }
Using old single-competition format, error: ...
Full team data: { ... }
Bot data created: { ... }
Registered competitions created: [ ... ]
=== FINAL API RESPONSE ===
Total competitions: 1
Registered competitions: [ ... ]
=========================
```

### Step 2: Check Browser Console

Open browser DevTools (F12) and look at the **Console** tab. You should see the API response.

Also check the **Network** tab:
1. Refresh the dashboard
2. Look for request to `/api/check-registration`
3. Click on it
4. Check the "Response" tab
5. Look for `registeredCompetitions` array

### Step 3: What to Look For

#### ✅ GOOD Response (Bot data present):
```json
{
  "registeredCompetitions": [
    {
      "id": "...",
      "competition_type": "ROBORACE",
      "bots": {
        "bot_name": "Speed Demon",
        "weight": 4.5,
        "dimensions": "50x40x30cm",
        "weapon_type": "Flipper",
        "is_weapon_bot": true
      }
    }
  ]
}
```

#### ❌ BAD Response (No bot data):
```json
{
  "registeredCompetitions": [
    {
      "id": "...",
      "competition_type": "ROBORACE",
      "bots": null  // ← Problem!
    }
  ]
}
```

OR

```json
{
  "registeredCompetitions": []  // ← Empty array!
}
```

---

## 🔧 Common Issues & Fixes

### Issue 1: `robot_name` is NULL in Database

**Symptom**: Terminal shows `Bot data created: null`

**Cause**: The `robot_name` field in your `teams` table is empty

**Fix**: Check your database:
```sql
SELECT robot_name, robot_weight, robot_dimensions, weapon_type 
FROM teams 
WHERE user_email = 'sushilsahani322@gmail.com'
```

If these are empty, you need to update them:
```sql
UPDATE teams 
SET 
  robot_name = 'Your Bot Name',
  robot_weight = 4.5,
  robot_dimensions = '50x40x30cm',
  weapon_type = 'Flipper'
WHERE user_email = 'sushilsahani322@gmail.com'
```

---

### Issue 2: Wrong Email Address

**Symptom**: Terminal shows `Check registration for: different@email.com`

**Cause**: Logged in user's email doesn't match team's `user_email`

**Fix**: 
1. Check what email you're logged in with
2. Verify it matches the email in `teams` table
3. Update the team's email if needed

---

### Issue 3: API Returns Empty Array

**Symptom**: `registeredCompetitions: []`

**Cause**: Team not found or query error

**Fix**: Check terminal for error messages. Look for:
- "Check registration for: ..." - shows the email being searched
- "Found: true/false" - shows if team was found
- Any error messages

---

### Issue 4: Competition Type Mismatch

**Symptom**: Shows "RoboRace" but you registered for different competition

**Current Behavior**: API defaults to "ROBORACE" for old registrations

**Fix**: We can detect the actual competition type. Let me know what competition you registered for.

---

## 🧪 Quick Test Commands

### Test 1: Check Your Team Data
Run this in Supabase SQL Editor:
```sql
SELECT 
  id,
  team_name,
  user_email,
  robot_name,
  robot_weight,
  robot_dimensions,
  weapon_type,
  payment_status,
  status
FROM teams 
WHERE user_email = 'sushilsahani322@gmail.com';
```

Expected result:
```
team_name: Rotor
robot_name: (should have a value)
robot_weight: (should have a number)
robot_dimensions: (should have dimensions)
weapon_type: (may be empty)
```

### Test 2: Check if Migration Ran
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('bots', 'competition_registrations');
```

Expected:
- If empty: Migration NOT run (using old format) ✅ Expected
- If returns rows: Migration run (should use new format)

---

## 📊 Debugging Checklist

Run through this checklist:

- [ ] **Step 1**: Dev server is running (`npm run dev`)
- [ ] **Step 2**: Refresh dashboard (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] **Step 3**: Check terminal - do you see console logs?
- [ ] **Step 4**: Check browser console - any errors?
- [ ] **Step 5**: Check Network tab - API response includes bot data?
- [ ] **Step 6**: Check Supabase - does your team have `robot_name`?

---

## 🎯 Expected Terminal Output

When everything works, you should see:

```
Check registration for: sushilsahani322@gmail.com Found: true { id: '...', team_name: 'Rotor', ... }
Competition query result: { competitions: null, competitionsError: { code: '42P01', message: 'relation "competition_registrations" does not exist' } }
Using old single-competition format, error: 42P01 relation "competition_registrations" does not exist
Full team data: {
  id: '...',
  team_name: 'Rotor',
  robot_name: 'Speed Demon',
  robot_weight: 4.5,
  robot_dimensions: '50x40x30cm',
  weapon_type: 'Flipper',
  payment_status: 'COMPLETED',
  ...
}
Bot data created: {
  id: null,
  bot_name: 'Speed Demon',
  weight: 4.5,
  dimensions: '50x40x30cm',
  weapon_type: 'Flipper',
  is_weapon_bot: true
}
Registered competitions created: [{
  id: '...',
  competition_type: 'ROBORACE',
  bots: { bot_name: 'Speed Demon', ... }
}]
=== FINAL API RESPONSE ===
Total competitions: 1
Registered competitions: [{ ... bots: { bot_name: 'Speed Demon' } }]
=========================
```

---

## 🚨 If Still Not Working

### Action Plan:

1. **Copy Terminal Output**
   - Copy ALL the console logs from terminal
   - Look for the lines starting with "Check registration", "Bot data created", etc.

2. **Copy Browser Network Response**
   - Open DevTools → Network tab
   - Refresh dashboard
   - Find `/api/check-registration` request
   - Copy the entire Response JSON

3. **Check Database**
   - Run the SQL query from Test 1 above
   - Copy the result

4. **Share This Info**
   - Terminal logs
   - Network response
   - Database query result
   - I can pinpoint the exact issue

---

## 💡 Quick Fix Attempts

### Fix 1: Hard Refresh
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

### Fix 2: Clear Browser Cache
```
DevTools → Application → Clear Storage → Clear site data
```

### Fix 3: Restart Dev Server
```bash
# Stop: Ctrl + C
npm run dev
```

### Fix 4: Check Email Match
Make sure the email you're logged in with matches the team's email in database.

---

## 📝 What the Logs Mean

| Log Message | Meaning |
|-------------|---------|
| `Check registration for: email@...` | API received request for this email |
| `Found: true` | Team found in database ✅ |
| `Found: false` | Team NOT found ❌ |
| `Using old single-competition format` | Fallback working ✅ |
| `Full team data: { ... }` | Team data retrieved successfully |
| `Bot data created: null` | No robot_name in database ❌ |
| `Bot data created: { bot_name: ... }` | Bot data created successfully ✅ |
| `Total competitions: 1` | API returning 1 competition ✅ |
| `Total competitions: 0` | API returning empty array ❌ |

---

## 🎯 Next Steps

1. **Check your terminal** now (where `npm run dev` is running)
2. **Refresh the dashboard** 
3. **Look for the console logs** I added
4. **Report back** what you see in terminal

The logs will tell us exactly where the issue is:
- Is team found?
- Is robot_name present?
- Is bot data being created?
- What's in the final API response?

**Please share the terminal output and we'll fix it!** 🔍
