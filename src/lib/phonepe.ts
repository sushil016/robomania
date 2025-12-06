import { StandardCheckoutClient, Env } from 'pg-sdk-node'

// Determine the correct environment
// Use PHONEPE_ENV to explicitly set sandbox/production mode
// This is important because NODE_ENV is always 'production' on Vercel
const phonepeEnvString = (process.env.PHONEPE_ENV || 'sandbox').toLowerCase()
const phonepeEnv = phonepeEnvString === 'production' ? Env.PRODUCTION : Env.SANDBOX

console.log('🔧 PhonePe SDK Configuration:', {
  nodeEnv: process.env.NODE_ENV,
  phonepeEnv: phonepeEnvString,
  usingMode: phonepeEnv === Env.PRODUCTION ? 'PRODUCTION' : 'SANDBOX',
  clientIdSet: !!process.env.PHONEPE_CLIENT_ID,
  clientSecretSet: !!process.env.PHONEPE_CLIENT_SECRET,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set (will use localhost:3000)'
})

// Validate environment variables
if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
  console.error('❌ PHONEPE_CLIENT_ID or PHONEPE_CLIENT_SECRET not set!')
  throw new Error('PhonePe credentials not configured. Please check your environment variables.')
}

// Initialize PhonePe SDK with credentials from environment
// Get instance for Standard Checkout
const phonepeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_CLIENT_ID,
  process.env.PHONEPE_CLIENT_SECRET,
  1, // Client version
  phonepeEnv,
  true // shouldPublishEvents - enables smoother experience
)

console.log('✅ PhonePe SDK initialized successfully in', phonepeEnv === Env.PRODUCTION ? 'PRODUCTION' : 'SANDBOX', 'mode')

export default phonepeClient

// Re-export types for convenience
export { StandardCheckoutClient, Env }
export type { 
  StandardCheckoutPayRequest,
  StandardCheckoutPayResponse,
  CreateSdkOrderRequest,
  CreateSdkOrderResponse,
  OrderStatusResponse,
  CallbackResponse
} from 'pg-sdk-node'
