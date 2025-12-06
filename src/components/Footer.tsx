'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 opacity-50" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
                RoboMania 2025
              </span>
            </h2>
            <p className="text-gray-600 mb-6">
              Organized by Bharati Vidyapeeth College of Engineering, Kharghar
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-600 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-600 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-600 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-600 hover:text-[#00CED1] transition-colors duration-200"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Event Details', 'Contact', 'About', 'Sponsors'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-[#00CED1] transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsors */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Our Sponsors</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://www.redbull.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  Red Bull
                </a>
              </li>
              <li>
                <a 
                  href="https://pntrobotics.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  PNT Robotics
                </a>
              </li>
              <li>
                <a 
                  href="https://www.hitechnology.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-cyan-600 transition-colors duration-200"
                >
                  Hi Technology
                </a>
              </li>
              <li>
                <a 
                  href="https://www.campa.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Campa Cola
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-orbitron mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>Sector 7, CBD Belapur, Navi Mumbai</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>teamrobonauts211@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-[#00CED1]" />
                <span>+91 9967612372</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-600">
          <p>© 2026 RoboMania. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

