# Quick Fix: PhonePe Not Working on Vercel

## The Problem
Cannot create orders on deployed URL: `https://robomania-teal.vercel.app/`

## The Solution
Add missing environment variable `NEXT_PUBLIC_APP_URL` in Vercel

---

## 🚀 Quick Fix Steps (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select project: **robomania-teal**
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar

### Step 2: Add Environment Variable
Click **Add New** and enter:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://robomania-teal.vercel.app
```

**Apply to**: ☑️ Production ☑️ Preview ☑️ Development

Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **⋮** menu (three dots)
4. Click **Redeploy**
5. Wait ~2 minutes for deployment

### Step 4: Test
1. Visit: https://robomania-teal.vercel.app/
2. Go to registration page
3. Fill form and select PhonePe
4. Click "Pay Now"
5. ✅ Should redirect to PhonePe payment page

---

## Why This Fixes It

**Before (Broken):**
```typescript
// Without NEXT_PUBLIC_APP_URL
const redirectUrl = `http://localhost:3000/api/phonepe/payment-callback`
// ❌ PhonePe tries to redirect to localhost (doesn't work!)
```

**After (Fixed):**
```typescript
// With NEXT_PUBLIC_APP_URL set
const redirectUrl = `https://robomania-teal.vercel.app/api/phonepe/payment-callback`
// ✅ PhonePe redirects to production URL (works!)
```

---

## Verify It's Working

### Check Environment Variable
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Confirm you see:
   ```
   NEXT_PUBLIC_APP_URL = https://robomania-teal.vercel.app
   ```

### Check Deployment Logs
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Functions** tab
4. Look for successful API calls in logs

### Test Payment Flow
1. Create a test registration
2. Select PhonePe payment
3. Check the URL you're redirected to
4. Should be PhonePe's payment page, not localhost

---

## Additional Environment Variables (If Missing)

While you're in Vercel Environment Variables, verify these are also set:

### PhonePe Credentials
```
PHONEPE_CLIENT_ID = M2304Z41NUN7S_2512031520
PHONEPE_CLIENT_SECRET = ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx
```

### Razorpay Credentials
```
RAZORPAY_KEY_ID = rzp_test_SJpqMYxzfRc7n7
RAZORPAY_KEY_SECRET = 4b4jVrdkzEXArmp0jjK19laqx
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_SJpqMYxzfRc7n7
```

### Supabase Credentials
```
NEXT_PUBLIC_SUPABASE_URL = https://nmtwczueujgvopyrfubh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Troubleshooting

### Still not working after adding NEXT_PUBLIC_APP_URL?

**Check 1: Did you redeploy?**
- Environment variables only take effect after redeployment
- Go to Deployments → Redeploy

**Check 2: Is the value correct?**
- Must be exactly: `https://robomania-teal.vercel.app`
- No trailing slash
- Must start with `https://`

**Check 3: Applied to correct environment?**
- Check that "Production" is selected
- If testing preview, also add to "Preview"

**Check 4: View logs**
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs production --limit 50
```

---

## What This Variable Does

`NEXT_PUBLIC_APP_URL` is used in 3 places:

1. **PhonePe Create Order** - Sets callback URL for payment redirect
2. **PhonePe Initiate Payment** - Sets redirect URL after payment
3. **Create Order API** - Internal API calls need correct domain

Without it, all these default to `http://localhost:3000` which doesn't work in production.

---

## Success Indicators

✅ Order creation succeeds
✅ PhonePe payment page opens
✅ Payment callback works
✅ Database updates correctly
✅ Dashboard shows payment status

---

## Need Help?

1. **Check Vercel Logs**:
   - Deployments → [Latest] → Functions
   - Look for error messages

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for API errors

3. **Check Network Tab**:
   - DevTools → Network
   - Look for failed API calls

4. **Common Errors**:
   - "Failed to create order" → Check environment variables
   - "Redirect to localhost" → NEXT_PUBLIC_APP_URL not set
   - "Database error" → Check Supabase credentials

---

## Summary

**The Fix**: Add `NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app` to Vercel

**Why**: PhonePe needs production URL for callbacks, not localhost

**Time**: 5 minutes (add variable + redeploy)

**Result**: PhonePe payments will work on production ✅

---

**Quick Copy-Paste for Vercel:**
```
NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app
```

🎉 That's it! After adding this and redeploying, PhonePe should work perfectly!
