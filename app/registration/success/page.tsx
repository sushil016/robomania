'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RegistrationSuccess() {
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const paymentId = searchParams.get('razorpay_payment_id')
    const orderId = searchParams.get('razorpay_order_id')
    const signature = searchParams.get('razorpay_signature')

    if (paymentId && orderId && signature) {
      verifyPayment(paymentId, orderId, signature)
    } else {
      setVerified(true) // No payment to verify
    }
  }, [searchParams])

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    setVerifying(true)
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, orderId, signature })
      })
      
      const data = await res.json()
      if (data.success) {
        setVerified(true)
      } else {
        setError('Payment verification failed')
      }
    } catch (err) {
      setError('Failed to verify payment')
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Verifying payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {error ? (
          <>
            <div className="text-red-500 mb-4">{error}</div>
            <Link
              href="/registration"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg"
            >
              Try Again
            </Link>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold font-orbitron mb-4">
              Registration Successful!
            </h1>
            <p className="text-white/60 mb-8">
              Thank you for registering. You will receive a confirmation email shortly.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg transition duration-200 hover:scale-105"
            >
              Return to Home
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

