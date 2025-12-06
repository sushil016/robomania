import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | RoboMania 2025',
  description: 'Privacy Policy for RoboMania 2025',
}

export default function PrivacyPolicyPage() {
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
          <div className="flex flex-col items-center justify-center text-center">
            {/* <Shield className="w-12 h-12 mb-4" /> */}
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-400 mt-2">Effective: December 7, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* Introduction */}
          <div className="p-6 bg-blue-50 border-l-4 border-blue-600">
            <p className="text-gray-700">
              Innovation and Robotics Lab operates RoboMania 2025 (Feb 16-17, 2025). This policy explains how we handle your data.
            </p>
          </div>

          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-3">1. What We Collect</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Team leader & member details (name, email, phone)</li>
              <li>Institution name and team information</li>
              <li>Robot specifications (name, weight, dimensions, weapons)</li>
              <li>Payment transaction IDs (via Razorpay/PhonePe)</li>
              <li>Cookies for user experience</li>
            </ul>
          </section>

          {/* How We Use It */}
          <section>
            <h2 className="text-2xl font-bold mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Process registrations and payments</li>
              <li>Send event updates</li>
              <li>Organize competitions and issue certificates</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <div className="p-6 bg-green-50 border-l-4 border-green-600">
            <h2 className="text-2xl font-bold mb-3">3. Data Sharing</h2>
            <p className="font-semibold text-gray-800">✓ We DO NOT share data with sponsors or third parties.</p>
            <p className="text-sm text-gray-600 mt-2">Limited sharing only with payment processors (Razorpay/PhonePe) and if legally required.</p>
          </div>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold mb-3">4. Security & Retention</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Encrypted transmission (HTTPS) and secure storage</li>
              <li>Data retained only for upcoming events</li>
              <li>You can request access, correction, or deletion</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-3">5. Your Rights</h2>
            <p className="text-gray-700">Contact us to access, correct, or delete your data: <a href="mailto:teamrobonauts211@gmail.com" className="text-blue-600 underline">teamrobonauts211@gmail.com</a></p>
          </section>

          {/* Contact */}
          <div className="p-6 bg-gray-100 border-2 border-gray-300">
            <h2 className="text-2xl font-bold mb-3">Contact</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Innovation and Robotics Lab</strong></p>
              <p>Room 211, Bharati Vidyapeeth College of Engineering</p>
              <p>Sector 7, CBD Belapur, Navi Mumbai, Maharashtra</p>
              <p>Email: teamrobonauts211@gmail.com | Phone: +91 9967612372</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">Governed by laws of Maharashtra, India.</p>
        </div>
      </div>
    </div>
  )
}
