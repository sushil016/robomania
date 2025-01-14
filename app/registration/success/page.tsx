'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center"
      >
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
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg transition duration-200"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  )
}

