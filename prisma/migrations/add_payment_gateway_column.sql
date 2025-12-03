-- Add payment_gateway column to competition_registrations table
-- This column tracks which payment gateway was used (RAZORPAY or PHONEPE)

ALTER TABLE competition_registrations 
ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(20) DEFAULT 'RAZORPAY';

-- Add phonepe_transaction_id column to store PhonePe transaction ID
ALTER TABLE competition_registrations 
ADD COLUMN IF NOT EXISTS phonepe_transaction_id VARCHAR(255);

-- Add index for faster lookups by payment gateway
CREATE INDEX IF NOT EXISTS idx_competition_registrations_payment_gateway 
ON competition_registrations(payment_gateway);

-- Update existing records to have RAZORPAY as default
UPDATE competition_registrations 
SET payment_gateway = 'RAZORPAY' 
WHERE payment_gateway IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN competition_registrations.payment_gateway IS 'Payment gateway used for transaction: RAZORPAY or PHONEPE';
COMMENT ON COLUMN competition_registrations.phonepe_transaction_id IS 'PhonePe transaction ID returned after payment completion';
