import { StandardCheckoutClient, Env } from 'pg-sdk-node'

// Initialize PhonePe SDK with credentials from environment
// Get instance for Standard Checkout
const phonepeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_CLIENT_ID!,
  process.env.PHONEPE_CLIENT_SECRET!,
  1, // Client version
  process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX,
  true // shouldPublishEvents - enables smoother experience
)

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
