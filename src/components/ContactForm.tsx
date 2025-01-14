'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, User, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: ''
  // })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-orbitron mb-4">
            <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              Contact Us
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-white/70 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white transition-all duration-200"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-white/70 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-white/70 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white transition-all duration-200"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg font-medium flex items-center justify-center group"
              >
                <Send className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-1" />
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

