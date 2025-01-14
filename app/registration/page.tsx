'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Registration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    teamName: '',
    institution: '',
    email: '',
    password: '',
    members: ['', '', ''],
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target
    if (name === 'members' && typeof index === 'number') {
      const newMembers = [...formData.members]
      newMembers[index] = value
      setFormData(prev => ({ ...prev, members: newMembers }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      // Store team data
      const { error: teamError } = await supabase
        .from('teams')
        .insert([
          {
            user_id: authData.user?.id,
            team_name: formData.teamName,
            institution: formData.institution,
            members: formData.members,
            phone_number: formData.phoneNumber,
          }
        ])

      if (teamError) throw teamError

      router.push('/registration/success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
        >
          <h1 className="text-3xl font-bold font-orbitron text-center mb-8 bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
            Team Registration
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    required
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Team Members
                  </label>
                  {formData.members.map((member, index) => (
                    <input
                      key={index}
                      type="text"
                      name="members"
                      required
                      value={member}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Member ${index + 1}`}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white mb-2"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] text-white"
                  />
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition duration-200"
                >
                  Previous
                </button>
              )}
              
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg transition duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

