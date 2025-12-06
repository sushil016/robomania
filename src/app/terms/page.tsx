import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | RoboMania 2025',
  description: 'Terms and Conditions for RoboMania 2025',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm hover:text-gray-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
            <p className="text-gray-400 mt-2">Effective: December 7, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* Event Info */}
          <div className="p-6 bg-blue-50 border-l-4 border-blue-600">
            <p className="text-gray-700">
              <strong>RoboMania 2025</strong> is organized by Innovation and Robotics Lab at Bharati Vidyapeeth College of Engineering, Navi Mumbai on <strong>February 16-17, 2025</strong>. By registering, you agree to these terms.
            </p>
          </div>

          {/* Registration */}
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Registration</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>No age limit</strong> - All participants welcome</li>
              <li>Team size: 2-5 members per competition</li>
              <li>Registration fees: RoboWars (₹300), RoboRace/RoboSoccer (₹200 each)</li>
              <li>One team can register for multiple competitions</li>
              <li>Accurate information required - organizers not liable for errors</li>
            </ul>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-bold mb-3">2. Payment</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Payment via Razorpay or PhonePe</li>
              <li><strong>NO REFUNDS</strong> once payment confirmed</li>
              <li>Registration confirmed only after successful payment</li>
            </ul>
          </section>

          {/* Competition Rules */}
          <section>
            <h2 className="text-2xl font-bold mb-3">3. Competition Rules</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Bot specifications: RoboWars (max 8kg), RoboRace (max 5kg), RoboSoccer (max 3kg)</li>
              <li>Detailed rules available in competition rulebooks</li>
              <li>Organizers' decisions are final</li>
              <li>Teams must follow safety protocols</li>
            </ul>
            <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-gray-700">
                📖 <strong>For complete competition rules, specifications, and regulations, refer to the official rulebooks.</strong>
              </p>
            </div>
          </section>

          {/* Conduct */}
          <section>
            <h2 className="text-2xl font-bold mb-3">4. Participant Conduct</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Respectful behavior towards organizers, judges, and participants</li>
              <li>No cheating, tampering, or unfair practices</li>
              <li>Violations may result in disqualification without refund</li>
            </ul>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-3">5. Liability</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Participants responsible for their equipment and safety</li>
              <li>Organizers not liable for damage, injury, or loss during event</li>
              <li>Participants waive claims against organizers</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold mb-3">6. Changes & Cancellation</h2>
            <p className="text-gray-700">Organizers reserve the right to modify schedule, rules, or cancel the event due to unforeseen circumstances. Refunds only if event cancelled by organizers.</p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-3">7. Media & Content</h2>
            <p className="text-gray-700">By participating, you consent to photography, videography, and use of your likeness for promotional purposes.</p>
          </section>

          {/* Contact */}
          <div className="p-6 bg-gray-100 border-2 border-gray-300">
            <h2 className="text-2xl font-bold mb-3">Questions?</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Innovation and Robotics Lab</strong></p>
              <p>Room 211, Bharati Vidyapeeth College of Engineering</p>
              <p>Sector 7, CBD Belapur, Navi Mumbai, Maharashtra</p>
              <p>Email: teamrobonauts211@gmail.com | Phone: +91 9967612372</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">Governed by laws of Maharashtra, India. Registration implies acceptance of these terms.</p>
        </div>
      </div>
    </div>
  )
}
