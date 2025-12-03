# Team Registration & Dashboard Updates - Complete Guide

## 🎯 What Was Updated

### 1. **Team Name Pre-filling for 2nd Registration**
When a user registers for an additional competition, their existing team name is automatically pre-filled in the registration form.

### 2. **Competition-Specific Team Information**
Dashboard now shows "Team Information for [Competition Name]" within each competition card instead of a separate section.

---

## 📋 Feature Details

### Feature 1: Auto Pre-fill Team Name

**Location**: `/src/app/team-register/page.tsx`

**How it Works**:
1. When user opens registration form, system checks if they have an existing team
2. If team exists, pre-fills the team name automatically
3. Uses two APIs in sequence:
   - First: `/api/check-registration` (checks current registration)
   - Fallback: `/api/team-details/name` (fetches team name from any previous registration)

**Code Flow**:
```javascript
// Step 1: Check current registration
const response = await fetch('/api/check-registration')
const data = await response.json()

if (data.hasRegistered && data.teamName) {
  // User has active team - use that name
  setFormData(prev => ({ ...prev, teamName: data.teamName }))
} else {
  // Step 2: Check for previous team name
  const teamNameResponse = await fetch(`/api/team-details/name?email=${userEmail}`)
  const teamNameData = await teamNameResponse.json()
  
  if (teamNameData.hasTeam && teamNameData.teamName) {
    // Pre-fill from previous registration
    setFormData(prev => ({ ...prev, teamName: teamNameData.teamName }))
  }
}
```

**User Experience**:
- ✅ **First Registration**: Team name field is empty
- ✅ **Second Registration (Same Email)**: Team name is automatically filled
- ✅ **Saves Time**: Users don't need to retype their team name
- ✅ **Consistent**: Ensures same team name across all competitions

---

### Feature 2: Competition-Specific Team Information

**Location**: `/src/app/dashboard/page.tsx`

**What Changed**:
- ❌ **Before**: Single "Team Information" section at the top
- ✅ **After**: "Team Information for [Competition]" inside each competition card

**Visual Structure**:
```
┌─────────────────────────────────────────────────┐
│ RoboRace                            [Paid]      │
│ ₹200                                            │
│─────────────────────────────────────────────────│
│ TEAM INFORMATION FOR ROBORACE                   │
│                                                 │
│ Team Leader          │ Team Members             │
│ ├─ John Doe          │ ├─ Jane Smith           │
│ │  john@example.com  │ │  jane@example.com     │
│ │  +91-9876543210    │ ├─ Bob Wilson           │
│                      │ │  bob@example.com       │
│─────────────────────────────────────────────────│
│ Bot: Thunder Bolt                               │
│ Weight: 7.5kg | Size: 60x60x40cm               │
│─────────────────────────────────────────────────│
│ Paid: 12/3/2025                                 │
└─────────────────────────────────────────────────┘
```

**Benefits**:
- ✅ **Clearer Context**: Shows which team registered for which competition
- ✅ **Better Organization**: All competition info in one card
- ✅ **Reduced Scrolling**: No separate section to scroll to
- ✅ **Scalability**: Works well when user has multiple competitions

---

## 🔧 API Endpoints Used

### 1. `/api/team-details/name` (NEW)
**Purpose**: Fetch team name for an email address

**Request**:
```http
GET /api/team-details/name?email=user@example.com
```

**Response**:
```json
{
  "success": true,
  "hasTeam": true,
  "teamName": "Team Phoenix"
}
```

**When to Use**:
- Pre-filling team name in registration forms
- Checking if user has registered before
- Displaying team name in UI components

---

### 2. `/api/check-registration` (UPDATED)
**Added Fields**:
- `leaderName` - Team leader's full name
- `leaderEmail` - Team leader's email
- `leaderPhone` - Team leader's phone
- `teamMembers[]` - Array of team member objects

**Full Response**:
```json
{
  "hasRegistered": true,
  "teamId": "uuid-123",
  "teamName": "Team Phoenix",
  "teamLocked": false,
  "leaderName": "John Doe",
  "leaderEmail": "john@example.com",
  "leaderPhone": "+91-9876543210",
  "teamMembers": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+91-9876543211",
      "role": "Member"
    },
    {
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "phone": "+91-9876543212",
      "role": "Member"
    }
  ],
  "registeredCompetitions": [
    {
      "id": "comp-uuid-1",
      "competition_type": "ROBORACE",
      "amount": 200,
      "payment_status": "COMPLETED",
      "registration_status": "CONFIRMED",
      "payment_date": "2025-12-03T10:30:00Z",
      "bots": {
        "bot_name": "Thunder Bolt",
        "weight": 7.5,
        "dimensions": "60x60x40cm",
        "weapon_type": "Hammer",
        "is_weapon_bot": true
      }
    }
  ],
  "savedBots": [],
  "totalCompetitions": 1
}
```

---

## 🎨 Dashboard Design Details

### Layout Changes

**Before**:
```
┌─────────────────────────┐
│ Team Name               │
│ Team Dashboard          │
├─────────────────────────┤
│ TEAM INFORMATION        │ ← Separate section
│ Leader + Members        │
├─────────────────────────┤
│ Stats: 1 | 1 | 0 | ₹200 │
├─────────────────────────┤
│ COMPETITIONS            │
│ ├─ RoboRace [Paid]      │
│ └─ Bot Details          │
└─────────────────────────┘
```

**After**:
```
┌─────────────────────────┐
│ Team Name               │
│ Team Dashboard          │
├─────────────────────────┤
│ Stats: 1 | 1 | 0 | ₹200 │
├─────────────────────────┤
│ COMPETITIONS            │
│ ┌───────────────────┐   │
│ │ RoboRace   [Paid] │   │
│ │───────────────────│   │
│ │ TEAM INFO FOR     │   │ ← Inside competition card
│ │ ROBORACE          │   │
│ │ Leader + Members  │   │
│ │───────────────────│   │
│ │ Bot: Thunder Bolt │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

### Typography & Spacing

**Competition Card**:
- Competition name: 14px bold
- Price: 12px gray
- Badge: 12px, black background if paid

**Team Information Section**:
- Heading: 12px bold uppercase ("TEAM INFORMATION FOR ROBORACE")
- Labels: 10px uppercase gray
- Leader name: 12px semibold
- Member names: 12px semibold
- Contact info: 10px gray
- Grid: 2 columns on desktop, stacks on mobile

**Bot Information**:
- Bot name: 12px bold
- Specs: 12px gray, 2 columns

---

## 🧪 Testing Scenarios

### Scenario 1: New User (First Registration)
**Steps**:
1. User creates account with email: `newuser@example.com`
2. User visits `/team-register`
3. Team name field is **empty**
4. User enters "Team Alpha" and completes registration

**Expected Result**: ✅ Registration succeeds

---

### Scenario 2: Returning User (Second Registration)
**Steps**:
1. User already registered for RoboRace with team "Team Alpha"
2. User visits `/team-register` again to register for RoboWars
3. System automatically fills "Team Alpha" in team name field
4. User selects RoboWars and completes registration

**Expected Result**: 
- ✅ Team name pre-filled as "Team Alpha"
- ✅ Same team name used for second competition
- ✅ Dashboard shows both competitions with same team info

---

### Scenario 3: Dashboard Display
**Given**: User registered for 2 competitions (RoboRace + RoboSoccer)

**When**: User opens dashboard

**Then**:
- ✅ Shows 2 competition cards
- ✅ Each card shows "TEAM INFORMATION FOR [COMPETITION NAME]"
- ✅ Each card shows same team leader and members
- ✅ Each card shows different bot details (if different bots used)
- ✅ Animations work smoothly on hover

---

## 🔄 Data Flow Diagram

```
User Opens Registration Form
          ↓
    Check Session
          ↓
    GET /api/check-registration
          ↓
    ┌─────────────────┐
    │ Has Team?       │
    └─────┬───────────┘
          ├─ YES → Pre-fill teamName from response
          │
          ├─ NO → GET /api/team-details/name
          │        ↓
          │   ┌─────────────────┐
          │   │ Has Previous?   │
          │   └────┬────────────┘
          │        ├─ YES → Pre-fill teamName
          │        └─ NO → Leave empty
          ↓
    Show Registration Form
```

---

## 📊 Database Queries

### Query 1: Fetch Team Name
```sql
SELECT team_name 
FROM teams 
WHERE user_email = 'user@example.com'
LIMIT 1
```

### Query 2: Fetch Team Members
```sql
SELECT name, email, phone, role 
FROM team_members 
WHERE team_id = 'team-uuid-123'
ORDER BY created_at ASC
```

### Query 3: Fetch Competition Registrations
```sql
SELECT 
  cr.id,
  cr.competition_type,
  cr.amount,
  cr.payment_status,
  cr.registration_status,
  cr.payment_date,
  b.bot_name,
  b.weight,
  b.dimensions,
  b.weapon_type
FROM competition_registrations cr
LEFT JOIN bots b ON cr.bot_id = b.id
WHERE cr.team_id = 'team-uuid-123'
ORDER BY cr.created_at ASC
```

---

## ✅ Completion Checklist

### APIs
- [x] Created `/api/team-details/name` endpoint
- [x] Updated `/api/check-registration` with team details
- [x] Both APIs tested and working

### Team Registration Page
- [x] Added team name pre-fill logic
- [x] Fetches from check-registration first
- [x] Falls back to team-details/name API
- [x] Handles new users gracefully
- [x] No TypeScript errors

### Dashboard
- [x] Removed standalone team info section
- [x] Added team info inside each competition card
- [x] Shows "Team Information for [Competition]"
- [x] Displays leader details
- [x] Displays team members list
- [x] Handles empty members list
- [x] Proper spacing and typography
- [x] Responsive on mobile
- [x] Animations working
- [x] No TypeScript errors

---

## 🚀 Next Steps (Optional Enhancements)

1. **Lock Team Name Field**: After pre-filling, make the team name field read-only to prevent changes

2. **Show Pre-fill Indicator**: Add a small badge "Auto-filled" next to team name

3. **Edit Team Button**: Add "Edit Team Info" button in competition cards

4. **Member Count Badge**: Show total member count badge (e.g., "3 members")

5. **Team Avatar**: Add team initials or avatar in team info section

6. **Expand/Collapse**: Make team info collapsible to save space

7. **Print View**: Add print-friendly view of team roster

---

## 📝 Summary

✅ **Team Name Pre-fill**: Automatically fills team name for returning users  
✅ **Competition-Specific Display**: Shows "Team Information for [Competition]"  
✅ **Improved Layout**: Team info integrated into competition cards  
✅ **Better UX**: Less scrolling, clearer context, faster registration  
✅ **No Errors**: All TypeScript checks passing  
✅ **Fully Responsive**: Works on mobile and desktop  

**Ready for Production!** 🎉

---

## 🐛 Troubleshooting

**Issue**: Team name not pre-filling
- Check user email in session
- Verify `/api/team-details/name` returns data
- Check browser console for errors
- Ensure user has registered before

**Issue**: Team info not showing in dashboard
- Run database migration first (`MIGRATION_MULTI_COMPETITION.sql`)
- Check `/api/check-registration` response
- Verify `leaderName` and `teamMembers` fields exist
- Check browser console for errors

**Issue**: Layout broken on mobile
- Clear browser cache
- Check responsive grid classes
- Verify Tailwind CSS is working
- Test on different screen sizes
