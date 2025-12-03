# PhonePe Payment Gateway Integration

This document explains the PhonePe payment gateway integration in the RoboMania application.

## Overview

RoboMania now supports **dual payment gateways**:
- **Razorpay** (existing)
- **PhonePe** (newly integrated)

Users can choose their preferred payment gateway during the registration/payment flow.

## Features

✅ **SDK-based Integration**: Uses PhonePe PG SDK Node.js v2  
✅ **Standard Checkout Flow**: Full payment page integration  
✅ **Order Management**: Create orders, initiate payments, check status  
✅ **Callback Handling**: Automatic payment verification via callbacks  
✅ **Database Tracking**: Stores payment gateway and transaction IDs  
✅ **Fallback Support**: Works with existing database schema  

## Environment Setup

### Required Environment Variables

Add these to your `.env` file:

```bash
# PhonePe Configuration
PHONEPE_CLIENT_ID="your_client_id"
PHONEPE_CLIENT_SECRET="your_client_secret"
PHONEPE_CALLBACK_USERNAME="your_callback_username"  # Optional - for callback validation
PHONEPE_CALLBACK_PASSWORD="your_callback_password"  # Optional - for callback validation
```

### Environment Selection

The SDK automatically selects the environment based on `NODE_ENV`:
- **Development**: `Env.SANDBOX` (test environment)
- **Production**: `Env.PRODUCTION` (live environment)

## API Endpoints

### 1. Create PhonePe Order
**POST** `/api/phonepe/create-order`

Creates a payment order using PhonePe SDK.

**Request Body:**
```json
{
  "competitions": ["ROBOWARS", "ROBORACE"],
  "teamData": {
    "teamName": "Team Phoenix",
    "leaderName": "John Doe",
    "leaderEmail": "john@example.com",
    "leaderPhone": "+919876543210",
    "institution": "ABC University",
    "teamMembers": [...]
  },
  "robotDetails": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "merchantOrderId": "ROBOMANIA_abc123_def456",
  "token": "order_token_here",
  "expireAt": 1234567890,
  "totalAmount": 500,
  "teamId": "team-uuid",
  "gateway": "phonepe"
}
```

### 2. Initiate PhonePe Payment
**POST** `/api/phonepe/initiate-payment`

Initiates payment flow and returns redirect URL.

**Request Body:**
```json
{
  "merchantOrderId": "ROBOMANIA_abc123_def456",
  "amount": 500,
  "userEmail": "john@example.com",
  "teamName": "Team Phoenix"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://phonepe.com/checkout/...",
  "merchantOrderId": "ROBOMANIA_abc123_def456"
}
```

### 3. Check Order Status
**POST** `/api/phonepe/order-status`

Checks payment status for a given order.

**Request Body:**
```json
{
  "merchantOrderId": "ROBOMANIA_abc123_def456"
}
```

**Response:**
```json
{
  "success": true,
  "state": "COMPLETED",
  "transactionId": "phonepe_txn_id",
  "amount": 500,
  "errorCode": null,
  "merchantOrderId": "ROBOMANIA_abc123_def456"
}
```

### 4. Payment Callback
**POST/GET** `/api/phonepe/payment-callback`

Handles PhonePe payment callbacks and redirects.

**Auto-redirects to:**
- Success: `/dashboard?payment=success`
- Failed: `/team-register?payment=failed`
- Pending: `/dashboard?payment=pending`

## Payment Flow

### User Journey

1. **Select Competitions** → User chooses competitions to register for
2. **Fill Team Details** → User provides team and member information
3. **Add Bot Details** → User enters robot specifications
4. **Choose Payment Gateway** → User selects Razorpay or PhonePe
5. **Complete Payment** → Redirected to payment gateway
6. **Verify Payment** → Automatic callback verification
7. **Confirmation** → User redirected to dashboard

### Technical Flow (PhonePe)

```
Frontend                API                    PhonePe SDK           Database
   |                     |                         |                    |
   |--Create Order------>|                         |                    |
   |                     |--Create SDK Order------>|                    |
   |                     |<-----Order Token--------|                    |
   |                     |--Save Registration----->|                    |
   |<---Order Details----|                         |                    |
   |                     |                         |                    |
   |--Initiate Payment-->|                         |                    |
   |                     |--Pay Request----------->|                    |
   |                     |<-----Redirect URL-------|                    |
   |<---Redirect---------|                         |                    |
   |                     |                         |                    |
   [User completes payment on PhonePe]             |                    |
   |                     |                         |                    |
   |                     |<---Payment Callback-----|                    |
   |                     |--Verify & Update------->|                    |
   |<---Success Page-----|                         |                    |
```

## Database Schema

### New Columns Added

**`competition_registrations` table:**

```sql
-- Payment gateway used (RAZORPAY or PHONEPE)
payment_gateway VARCHAR(20) DEFAULT 'RAZORPAY'

-- PhonePe transaction ID
phonepe_transaction_id VARCHAR(255)
```

### Migration

Run the migration SQL:
```bash
psql -d your_database -f prisma/migrations/add_payment_gateway_column.sql
```

Or apply via Supabase SQL Editor:
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Paste contents of `add_payment_gateway_column.sql`
4. Run the query

## Frontend Integration

### Payment Gateway Selection

The `PaymentOptions` component now includes gateway selection:

```tsx
<PaymentOptions
  totalAmount={500}
  onPayNow={(gateway) => handleSubmit('now', gateway)}
  onPayLater={() => handleSubmit('later')}
  isLoading={false}
/>
```

Users see two buttons to choose between Razorpay and PhonePe.

### Payment Handler

```typescript
const handleSubmit = async (
  paymentMethod: 'now' | 'later', 
  gateway?: 'razorpay' | 'phonepe'
) => {
  if (gateway === 'phonepe') {
    // PhonePe flow
    const order = await fetch('/api/phonepe/create-order', { ... })
    const payment = await fetch('/api/phonepe/initiate-payment', { ... })
    window.location.href = payment.redirectUrl
  } else {
    // Razorpay flow (existing)
    const order = await fetch('/api/create-order', { ... })
    const razorpay = new window.Razorpay({ ... })
    razorpay.open()
  }
}
```

## Testing

### Test Credentials

PhonePe provides a sandbox environment for testing:

- **Client ID**: Use the sandbox client ID from PhonePe dashboard
- **Client Secret**: Use the sandbox client secret
- **Test Cards**: Use PhonePe test card numbers

### Test Payment Flow

1. Start the development server: `npm run dev`
2. Navigate to `/team-register`
3. Fill in the registration form
4. Select PhonePe as payment gateway
5. Complete payment with test credentials
6. Verify redirect to success page

### Verify Database Updates

```sql
SELECT 
  id, 
  team_id, 
  competition_type, 
  payment_gateway, 
  payment_status,
  phonepe_transaction_id
FROM competition_registrations
WHERE payment_gateway = 'PHONEPE'
ORDER BY created_at DESC
LIMIT 10;
```

## Error Handling

### Common Errors

1. **"Failed to create PhonePe order"**
   - Check PhonePe credentials in `.env`
   - Verify client ID and secret are correct
   - Ensure SDK is properly installed

2. **"Invalid callback"**
   - Set `PHONEPE_CALLBACK_USERNAME` and `PHONEPE_CALLBACK_PASSWORD` in `.env`
   - Configure these credentials on PhonePe dashboard
   - Or skip validation by leaving them empty (for testing)

3. **"Payment verification failed"**
   - Check order status API response
   - Verify database connection
   - Check PhonePe transaction logs

### Logging

All PhonePe APIs include comprehensive logging:

```typescript
console.log('✅ PhonePe order created:', merchantOrderId)
console.log('⏳ Payment pending')
console.log('❌ Payment failed:', error)
```

## Security Considerations

### Callback Validation

PhonePe callbacks are validated using:
- **Authorization header**: Signed with merchant credentials
- **Username/Password**: Set on PhonePe dashboard
- **SDK validation**: Built-in signature verification

```typescript
const callbackResponse = phonepeClient.validateCallback(
  username, 
  password, 
  authorization, 
  body
)
```

### Environment Variables

**Never commit these to version control:**
- `PHONEPE_CLIENT_SECRET`
- `PHONEPE_CALLBACK_USERNAME`
- `PHONEPE_CALLBACK_PASSWORD`

Use `.env.local` for local development and secure storage for production.

## Production Checklist

Before going live:

- [ ] Update PhonePe credentials to production keys
- [ ] Set `NODE_ENV=production`
- [ ] Configure callback URL on PhonePe dashboard
- [ ] Set callback username/password
- [ ] Test end-to-end payment flow
- [ ] Run database migration
- [ ] Verify SSL certificate on callback URL
- [ ] Set up error monitoring
- [ ] Test refund flow (if implemented)
- [ ] Update webhook URLs
- [ ] Enable production logging

## Support

### PhonePe Documentation
- [Standard Checkout Documentation](https://developer.phonepe.com/payment-gateway/backend-sdk/nodejs-be-sdk)
- [API Reference](https://developer.phonepe.com/payment-gateway/backend-sdk/nodejs-be-sdk/api-reference-node-js)

### Internal Support
- Email: support@robomania.com
- Phone: +91 98765 43210

## Future Enhancements

Planned features:
- [ ] Refund API integration
- [ ] Subscription payments
- [ ] EMI options
- [ ] Auto-debit/recurring payments
- [ ] Payment analytics dashboard
- [ ] WhatsApp payment notifications

---

**Last Updated**: January 2025  
**Version**: 1.0.0
