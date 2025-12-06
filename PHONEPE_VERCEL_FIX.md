# PhonePe Deployment Configuration for Vercel

## Issue: Cannot Create Order on Deployed URL

### Root Cause
The PhonePe payment system is not working on `https://robomania-teal.vercel.app/` because:
1. `NEXT_PUBLIC_APP_URL` environment variable is not set
2. PhonePe redirect URLs default to `http://localhost:3000` in production
3. PhonePe may need the production URL whitelisted in their dashboard

## Critical Environment Variables for Vercel

### 1. Set NEXT_PUBLIC_APP_URL (CRITICAL)

This variable is used in:
- `/api/phonepe/create-order/route.ts` - Line 160
- `/api/phonepe/initiate-payment/route.ts` - Line 17

**Add this in Vercel:**
```env
NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app
```

**Why it's critical:**
```typescript
// Current code uses this:
const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`

// Without NEXT_PUBLIC_APP_URL set, it becomes:
// http://localhost:3000/api/phonepe/payment-callback?... 
// ❌ This will NOT work in production!

// With NEXT_PUBLIC_APP_URL set, it becomes:
// https://robomania-teal.vercel.app/api/phonepe/payment-callback?...
// ✅ This works correctly!
```

### 2. PhonePe Credentials

```env
PHONEPE_CLIENT_ID=M2304Z41NUN7S_2512031520
PHONEPE_CLIENT_SECRET=ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx
```

### 3. Optional: PhonePe Callback Authentication
```env
PHONEPE_CALLBACK_USERNAME=your_username
PHONEPE_CALLBACK_PASSWORD=your_password
```

## Step-by-Step Fix for Vercel Deployment

### Step 1: Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `robomania-teal`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://robomania-teal.vercel.app` | Production, Preview, Development |
| `PHONEPE_CLIENT_ID` | `M2304Z41NUN7S_2512031520` | Production, Preview, Development |
| `PHONEPE_CLIENT_SECRET` | `ZGIyYmZmYzAtYzVhYy00MGM0LThjMzMtYzI5NWVjNzMyOTMx` | Production, Preview, Development |

### Step 2: Configure PhonePe Dashboard (If Required)

1. Login to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to **API Credentials** section
3. Add callback URL whitelist:
   ```
   https://robomania-teal.vercel.app/api/phonepe/payment-callback
   ```
4. Enable SANDBOX mode for testing (or PRODUCTION if ready)

### Step 3: Update Local .env File

Add to your `.env` file:
```env
# App URL (use appropriate URL for each environment)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For local development
# NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app  # For production
```

### Step 4: Verify Razorpay Configuration (Bonus)

While we're at it, ensure Razorpay is also configured:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Step 5: Verify Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 6: Redeploy

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for deployment to complete

### Step 7: Test on Production

1. Visit `https://robomania-teal.vercel.app/`
2. Go through registration flow
3. Select PhonePe payment
4. Verify redirect URL is correct
5. Complete payment
6. Check if callback works

## Environment-Specific Configuration

### Local Development
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```
**PhonePe SDK**: Uses SANDBOX environment

### Vercel Deployment
```env
NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app
NODE_ENV=production
```
**PhonePe SDK**: Uses PRODUCTION environment

## Code References

### Where NEXT_PUBLIC_APP_URL is Used

1. **PhonePe Create Order** (`/api/phonepe/create-order/route.ts:160`)
   ```typescript
   const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
   ```

2. **PhonePe Initiate Payment** (`/api/phonepe/initiate-payment/route.ts:17`)
   ```typescript
   const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/phonepe/payment-callback?merchantOrderId=${merchantOrderId}`
   ```

3. **Create Order (Razorpay)** (`/api/create-order/route.ts`)
   ```typescript
   const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/register`, ...)
   ```

### PhonePe Environment Detection

**File**: `/src/lib/phonepe.ts`
```typescript
const phonepeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_CLIENT_ID!,
  process.env.PHONEPE_CLIENT_SECRET!,
  1, // Client version
  process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX,
  true // shouldPublishEvents
)
```

## Troubleshooting

### Issue 1: "Failed to create PhonePe order"
**Solution**: 
- Check Vercel logs: `vercel logs --follow`
- Verify `PHONEPE_CLIENT_ID` and `PHONEPE_CLIENT_SECRET` are set
- Check PhonePe dashboard for API status

### Issue 2: Payment callback redirects to localhost
**Solution**:
- Verify `NEXT_PUBLIC_APP_URL` is set to `https://robomania-teal.vercel.app`
- Redeploy after setting the variable
- Clear browser cache

### Issue 3: "Callback URL not whitelisted"
**Solution**:
- Login to PhonePe Business Dashboard
- Add `https://robomania-teal.vercel.app/api/phonepe/payment-callback` to whitelist
- Wait 5-10 minutes for changes to propagate

### Issue 4: Payment succeeds but database not updated
**Solution**:
- Check Vercel function logs
- Verify Supabase credentials are correct
- Test `/api/phonepe/order-status` endpoint manually
- Use manual verification button on dashboard

## Testing Checklist

### Before Deployment
- [ ] All environment variables set in Vercel
- [ ] NEXT_PUBLIC_APP_URL = https://robomania-teal.vercel.app
- [ ] PhonePe credentials verified
- [ ] Supabase credentials verified
- [ ] Razorpay credentials verified

### After Deployment
- [ ] Visit deployed URL
- [ ] Check console for environment variable values
- [ ] Test registration flow
- [ ] Test PhonePe payment
- [ ] Verify callback URL in PhonePe redirect
- [ ] Complete test payment
- [ ] Verify database updates
- [ ] Check dashboard shows payment

### Logs to Monitor
```bash
# View Vercel logs in real-time
vercel logs --follow

# Check for these messages:
# ✅ "PhonePe order created"
# ✅ "Bot created with ID"
# ✅ "Created new registration"
# ✅ "Payment callback received"
```

## Quick Fix Summary

**Immediate Action Required:**
1. Add to Vercel Environment Variables:
   ```
   NEXT_PUBLIC_APP_URL=https://robomania-teal.vercel.app
   ```
2. Redeploy
3. Test payment flow

**Optional (If Still Not Working):**
- Whitelist callback URL in PhonePe dashboard
- Enable CORS for your domain
- Check PhonePe API credentials
- Verify Supabase connection

## Expected Behavior After Fix

### Registration Flow
1. User fills registration form
2. Selects PhonePe payment
3. Clicks "Pay Now"
4. Order created with logs: "✅ PhonePe order created: ROBOMANIA_xxx"
5. Redirects to: `https://business.phonepe.com/pay/ROBOMANIA_xxx`
6. User completes payment on PhonePe
7. PhonePe redirects to: `https://robomania-teal.vercel.app/api/phonepe/payment-callback?merchantOrderId=ROBOMANIA_xxx`
8. Callback updates database
9. User redirected to dashboard with success message

### Console Logs (Production)
```
Creating PhonePe order...
Creating bot for ROBOWARS: Destroyer Bot
✅ Bot created with ID: 123e4567-e89b-12d3-a456-426614174000
✅ Created new registration for ROBOWARS with bot 123e4567-e89b-12d3-a456-426614174000
✅ PhonePe order created: ROBOMANIA_12345678_abcd1234
```

## Support

If issues persist after setting environment variables:

1. **Check Vercel Logs**:
   ```bash
   vercel logs production --limit 100
   ```

2. **Check PhonePe Status**:
   - Visit PhonePe Business Dashboard
   - Check API health status
   - Verify credentials are active

3. **Test Endpoints**:
   ```bash
   # Test create order
   curl -X POST https://robomania-teal.vercel.app/api/phonepe/create-order \
     -H "Content-Type: application/json" \
     -d '{"competitions": ["ROBOWARS"], "teamData": {...}}'
   ```

## Success Criteria

✅ Order creation succeeds on `https://robomania-teal.vercel.app`
✅ PhonePe redirect URL points to production domain
✅ Payment callback updates database correctly
✅ Bots are created in database
✅ Multiple entries work for RoboRace/RoboSoccer
✅ Dashboard shows all registrations

🎉 **After setting NEXT_PUBLIC_APP_URL, PhonePe payments will work on production!**
