'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, CreditCard, HelpCircle, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/validation'
import { useState } from 'react'

interface PaymentOptionsProps {
  totalAmount: number
  onPayNow: (gateway: 'razorpay' | 'phonepe') => void
  onPayLater: () => void
  isLoading: boolean
}

export function PaymentOptions({ totalAmount, onPayNow, onPayLater, isLoading }: PaymentOptionsProps) {
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'phonepe'>('razorpay')

  return (
    <div className="space-y-6">
      {/* Payment Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-green-600" />
          <h3 className="font-semibold text-gray-900">Secure Payment Gateway</h3>
        </div>
        <p className="text-sm text-gray-700 ml-9">
          Your payment information is encrypted and secure. We support UPI, Cards, Net Banking, and Wallets through multiple payment providers.
        </p>
      </motion.div>

      {/* Payment Gateway Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Choose Payment Gateway</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedGateway('razorpay')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedGateway === 'razorpay'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="font-semibold text-gray-900">Razorpay</div>
            <div className="text-xs text-gray-600 mt-1">UPI, Cards, Wallets</div>
          </button>
          <button
            onClick={() => setSelectedGateway('phonepe')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedGateway === 'phonepe'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="font-semibold text-gray-900">PhonePe</div>
            <div className="text-xs text-gray-600 mt-1">UPI, Cards, Wallets</div>
          </button>
        </div>
      </motion.div>

      {/* Payment Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pay Now Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative border-2 border-blue-600 bg-blue-50 rounded-xl p-6 cursor-pointer"
          onClick={!isLoading ? () => onPayNow(selectedGateway) : undefined}
        >
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
              RECOMMENDED
            </span>
          </div>

          <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Now</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatCurrency(totalAmount)}
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Instant confirmation & seat booking</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Receive event details immediately</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Priority support & updates</span>
            </li>
          </ul>

          <button
            onClick={() => !isLoading && onPayNow(selectedGateway)}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Continue with ${selectedGateway === 'razorpay' ? 'Razorpay' : 'PhonePe'}`}
          </button>
        </motion.div>

        {/* Pay Later Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-gray-300 bg-white rounded-xl p-6 cursor-pointer"
          onClick={!isLoading ? onPayLater : undefined}
        >
          <Clock className="w-8 h-8 text-gray-600 mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Later</h3>
          <div className="text-3xl font-bold text-gray-600 mb-4">
            {formatCurrency(totalAmount)}
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Registration saved as draft</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Complete payment from dashboard</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Payment deadline: 3 days before event</span>
            </li>
          </ul>

          <button
            disabled={isLoading}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Pay Later'}
          </button>
        </motion.div>
      </div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
            <p className="text-sm text-gray-700 mb-2">
              Having trouble with payment? Contact our support team for assistance.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="mailto:support@robomania.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@robomania.com
              </a>
              <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-700 font-medium">
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Refund Policy */}
      <p className="text-xs text-center text-gray-500">
        * Registration fees are non-refundable after confirmation. Please review all details before payment.
      </p>
    </div>
  )
}
