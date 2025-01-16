'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function RegistrationSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const orderId = searchParams ? searchParams.get('order_id') : null

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (orderId && paymentStatus === 'pending') {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const result = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              }),
            })

            if (result.ok) {
              setPaymentStatus('success')
              showConfetti()
            } else {
              setPaymentStatus('failed')
            }
          } catch (error) {
            setPaymentStatus('failed')
          }
        },
        modal: {
          ondismiss: () => {
            router.push('/registration')
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    }
  }, [orderId, paymentStatus, router])

  const showConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center"
      >
        {paymentStatus === 'pending' ? (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-[#00CED1] mb-6 animate-spin" />
            <h1 className="text-2xl font-bold font-orbitron mb-4">
              Processing Payment...
            </h1>
          </>
        ) : paymentStatus === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 mx-auto text-[#00CED1] mb-6" />
            </motion.div>
            <h1 className="text-2xl font-bold font-orbitron mb-4 bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              Registration Successful!
            </h1>
            <p className="text-white/70 mb-8">
              Thank you for registering for RoboMania 2025. We have sent a confirmation email with further details.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold font-orbitron mb-4 text-red-500">
              Payment Failed
            </h1>
            <p className="text-white/70 mb-8">
              There was an issue processing your payment. Please try again.
            </p>
          </>
        )}
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg transition duration-200 hover:scale-105"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  )
}

