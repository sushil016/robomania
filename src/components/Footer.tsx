'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
                RoboMania 2025
              </span>
            </h2>
            <p className="text-white/60 mb-6">
              Organized by Bharati Vidyapeeth College of Engineering, Kharghar
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-white/60 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-white/60 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-white/60 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-white/60 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Event Details', 'Registration', 'Live Updates', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/60 hover:text-[#00CED1] transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-white/60">
                <MapPin className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>Sector 7, CBD Belapur, Navi Mumbai</span>
              </li>
              <li className="flex items-center text-white/60">
                <Mail className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>info@robomania2025.com</span>
              </li>
              <li className="flex items-center text-white/60">
                <Phone className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>+91 123 456 7890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Newsletter</h3>
            <p className="text-white/60 mb-4">
              Subscribe to stay updated with latest news and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-r-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
          <p>© 2024 RoboMania. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

