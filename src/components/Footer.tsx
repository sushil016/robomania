import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold font-orbitron text-neon-green mb-4">RoboMania 2025</h2>
            <p className="text-sm">Organized by Bharati Vidyapeeth College of Engineering, Kharghar</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/event-details" className="hover:text-neon-green transition-colors duration-200">Event Details</Link></li>
              <li><Link href="/registration" className="hover:text-neon-green transition-colors duration-200">Registration</Link></li>
              <li><Link href="/live-updates" className="hover:text-neon-green transition-colors duration-200">Live Updates</Link></li>
              <li><Link href="/contact" className="hover:text-neon-green transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-neon-green transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-neon-green transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-white hover:text-neon-green transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="mailto:contact@robomania2025.com" className="text-white hover:text-neon-green transition-colors duration-200">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm">&copy; 2025 RoboMania. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

