import { Metadata } from 'next'
import Link from 'next/link'
import { DollarSign, ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy | RoboMania 2025',
  description: 'Refund Policy for RoboMania 2025',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-">
        <div className="container mx-auto px-4">
          {/* <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm hover:text-gray-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link> */}
          <div className="flex flex-col items-center justify-center text-center py-4">
            {/* <DollarSign className="w-12 h-12 mb-4" /> */}
            <h1 className="text-3xl md:text-4xl font-bold py-4">Refund Policy</h1>
            <p className="text-gray-400 mt-2">Effective: December 7, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* NO REFUND Notice */}
          <div className="p-8 bg-red-50 border-4 border-red-500">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-black text-red-600 mb-3">NO REFUND POLICY</h2>
                <p className="text-gray-800 text-lg font-semibold mb-2">
                  All registration fees are <strong>non-refundable</strong> once payment is completed.
                </p>
                <p className="text-gray-700">
                  By completing registration and payment for RoboMania 2025, you acknowledge and accept that refunds will not be issued under any circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Details */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Policy Details</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border-l-4 border-gray-400">
                <h3 className="font-bold text-gray-800 mb-2">✕ No Refunds If:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You change your mind after registration</li>
                  <li>You cannot attend the event</li>
                  <li>Your team is incomplete or members drop out</li>
                  <li>Your robot doesn't meet specifications</li>
                  <li>You're disqualified for rule violations</li>
                  <li>Technical issues on your end prevent participation</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border-l-4 border-green-500">
                <h3 className="font-bold text-gray-800 mb-2">✓ Refund Only If:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li><strong>Event cancelled by organizers</strong> - Full refund within 14 business days</li>
                  <li><strong>Duplicate payment</strong> - Excess amount refunded immediately</li>
                  <li><strong>Payment processing error</strong> - Resolved within 7 business days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Registration Transfer */}
          <section>
            <h2 className="text-2xl font-bold mb-3">Registration Transfer</h2>
            <p className="text-gray-700 mb-2">Limited transfer option available:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Transfer to another team with <strong>7 days notice</strong> before event</li>
              <li>Processing fee: <strong>₹100</strong></li>
              <li>Contact: teamrobonauts211@gmail.com</li>
              <li>Not applicable if transferred team violates rules</li>
            </ul>
          </section>

          {/* Payment Issues */}
          <section>
            <h2 className="text-2xl font-bold mb-3">Payment Issues</h2>
            <p className="text-gray-700">For payment errors, transaction failures, or duplicate charges, contact us immediately with:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
              <li>Transaction ID</li>
              <li>Payment screenshot</li>
              <li>Registered email</li>
            </ul>
          </section>

          {/* Pre-Registration Checklist */}
          <div className="p-6 bg-yellow-50 border-2 border-yellow-300">
            <h2 className="text-xl font-bold mb-3">⚠️ Before You Register</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Confirm team availability for Feb 16-17, 2025</li>
              <li>✓ Review competition rulebooks</li>
              <li>✓ Ensure robot meets specifications</li>
              <li>✓ Verify team member details</li>
              <li>✓ Understand NO REFUND policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="p-6 bg-gray-100 border-2 border-gray-300">
            <h2 className="text-2xl font-bold mb-3">Contact for Payment Issues</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Innovation and Robotics Lab</strong></p>
              <p>Room 211, Bharati Vidyapeeth College of Engineering</p>
              <p>Sector 7, CBD Belapur, Navi Mumbai, Maharashtra</p>
              <p>Email: teamrobonauts211@gmail.com | Phone: +91 9967612372</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">
            This policy is governed by laws of Maharashtra, India. Last updated: December 7, 2025.
          </p>
        </div>
      </div>
    </div>
  )
}
