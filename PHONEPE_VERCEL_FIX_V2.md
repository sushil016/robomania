# 🔧 PhonePe Vercel Deployment Fix

## Problem
PhonePe orders work on localhost but fail on Vercel with error:
```
"Client Not Found, trackingId: bedda1f5b8f14b8a"
```

## Root Cause
The code was using `NODE_ENV` to determine PhonePe environment mode. On Vercel, `NODE_ENV` is always `"production"`, so it was trying to use **PRODUCTION mode** with **SANDBOX credentials**, causing the "Client Not Found" error.

## Solution Applied ✅

### 1. Updated PhonePe Configuration (`src/lib/phonepe.ts`)
- Added explicit `PHONEPE_ENV` environment variable
- Now uses `PHONEPE_ENV` instead of `NODE_ENV` to determine sandbox vs production
- Added better validation and logging

### 2. Updated Environment Files
- Added `PHONEPE_ENV=sandbox` to `.env`
- Updated `.env.example` with documentation

## 🚀 Steps to Fix on Vercel

### Step 1: Add Environment Variable on Vercel
1. Go to your Vercel project: https://vercel.com/sushil016s-projects/robomania-teal
2. Click on **Settings** → **Environment Variables**
3. Add this new variable:

   ```
   Name: PHONEPE_ENV
   Value: sandbox
   ```

4. Apply to: **Production, Preview, and Development**
5. Click **Save**

### Step 2: Verify Existing PhonePe Variables
Make sure these are also set in Vercel:

```
PHONEPE_CLIENT_ID=M2304Z41NUN7S_2512031520
PHONEPE_CLIENT_SECRET=ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx
```

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** (or push a new commit to trigger automatic deployment)

## 🎯 Testing After Deployment

### Test PhonePe Order Creation:
1. Visit: https://robomania-teal.vercel.app
2. Try to create a team and register with PhonePe payment
3. Check browser console for logs
4. Check Vercel function logs for server-side output

### Expected Behavior:
- ✅ Order should be created successfully
- ✅ You should be redirected to PhonePe payment page
- ✅ Logs should show: `"PhonePe SDK initialized successfully in SANDBOX mode"`

## 📊 Verification Checklist

- [ ] `PHONEPE_ENV=sandbox` added to Vercel
- [ ] `PHONEPE_CLIENT_ID` exists in Vercel
- [ ] `PHONEPE_CLIENT_SECRET` exists in Vercel
- [ ] Code changes deployed to Vercel
- [ ] Tested order creation on deployed site
- [ ] Payment flow works end-to-end

## 🔄 When to Switch to Production Mode

When you get **production credentials** from PhonePe:

### Step 1: Get Production Credentials
- Apply for production access on PhonePe Business Dashboard
- Get production `CLIENT_ID` and `CLIENT_SECRET`

### Step 2: Update Vercel Environment Variables
```
PHONEPE_ENV=production
PHONEPE_CLIENT_ID=<your-production-client-id>
PHONEPE_CLIENT_SECRET=<your-production-client-secret>
```

### Step 3: Update Callback URLs
On PhonePe dashboard, configure production callback URL:
```
https://robomania-teal.vercel.app/api/phonepe/payment-callback
```

## 🐛 Troubleshooting

### If orders still fail after fix:

1. **Check Vercel Function Logs:**
   - Go to Vercel → Deployments → Latest → Functions
   - Look for PhonePe initialization logs
   - Should see: `"PhonePe SDK initialized successfully in SANDBOX mode"`

2. **Verify Environment Variables:**
   ```bash
   # In Vercel dashboard, check all three are set:
   PHONEPE_ENV
   PHONEPE_CLIENT_ID
   PHONEPE_CLIENT_SECRET
   ```

3. **Clear Browser Cache:**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Or open in incognito/private window

4. **Check PhonePe Dashboard:**
   - Verify credentials are active
   - Check if sandbox mode is enabled for your account

### Common Issues:

| Error | Cause | Solution |
|-------|-------|----------|
| "Client Not Found" | Wrong environment mode | Set `PHONEPE_ENV=sandbox` |
| "Invalid credentials" | Wrong CLIENT_ID/SECRET | Verify credentials in Vercel |
| "Callback failed" | Wrong redirect URL | Check NEXT_PUBLIC_APP_URL |

## 📝 Quick Reference

### Local Development (.env file):
```env
PHONEPE_ENV=sandbox
PHONEPE_CLIENT_ID=M2304Z41NUN7S_2512031520
PHONEPE_CLIENT_SECRET=ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx
```

### Vercel Production (Environment Variables):
```
PHONEPE_ENV=sandbox  # or 'production' when you have prod credentials
PHONEPE_CLIENT_ID=M2304Z41NUN7S_2512031520
PHONEPE_CLIENT_SECRET=ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx
```

## ✅ Success Indicators

After applying the fix, you should see:
- ✅ PhonePe orders create successfully on Vercel
- ✅ Console logs show "SANDBOX mode" initialization
- ✅ No "Client Not Found" errors
- ✅ Payment redirection works properly

---

**Last Updated:** December 6, 2025
**Status:** Fixed - Awaiting Vercel deployment
