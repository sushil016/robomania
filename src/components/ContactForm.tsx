'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className=" z-10">
          
          
        </div>
        <div></div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-black/30 p-8 rounded-lg backdrop-blur-sm border border-white/10"
        >
          <h1 className="text-4xl font-bold font-orbitron mb-4 bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
            Contact Us
          </h1> 
          <p className="text-white/60">
            Have questions? We'd love to hear from you.
          </p>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-lg font-semibold 
              hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
            ) : (
              'Send Message'
            )}
          </button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-sm text-center"
            >
              Message sent successfully!
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </div>
  )
}

