'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Bot, School } from 'lucide-react'
import LoginButton from '@/components/LoginButton'
import type { Session } from 'next-auth'


interface FormData {
  teamName: string
  institution: string
  contactEmail: string
  contactPhone: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  robotName: string
  robotWeight: string | number
  robotDimensions: string
  weaponType: string
  members: {
    name: string
    email: string
    phone: string
    role: string
  }[]
}

export default function Registration() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const authError = searchParams ? searchParams.get('error') : null
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    institution: '',
    contactEmail: session?.user?.email || '',
    contactPhone: '',
    leaderName: session?.user?.name || '',
    leaderEmail: session?.user?.email || '',
    leaderPhone: '',
    robotName: '',
    robotWeight: '',
    robotDimensions: '',
    weaponType: '',
    members: [
      { name: '', email: '', phone: '', role: '' },
      { name: '', email: '', phone: '', role: '' }
    ]
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen py-36 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold font-orbitron mb-6 bg-gradient-to-r from-vibrant-orange to-turquoise bg-clip-text text-transparent">
            Sign in to Register
          </h1>
          {authError && (
            <div className="text-red-500 mb-4">
              There was an error signing in. Please try again.
            </div>
          )}
          <p className="text-white/60 mb-8">
            Please sign in with Google to register your team
          </p>
          <LoginButton />
        </div>
      </div>
    )
  }

  const validateForm = () => {
    if (currentStep === 1) {
      if (!formData.teamName || !formData.institution || !formData.contactEmail || !formData.contactPhone) {
        setError('Please fill in all required fields')
        return false
      }
    } else if (currentStep === 2) {
      if (!formData.robotName || !formData.robotWeight || !formData.robotDimensions || !formData.weaponType) {
        setError('Please fill in all robot details')
        return false
      }
    } else if (currentStep === 3) {
      const validMembers = formData.members.filter(m => m.name && m.email && m.phone && m.role)
      if (validMembers.length < 2) {
        setError('Please add at least 2 team members')
        return false
      }
    }
    setError('')
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const cleanedMembers = formData.members.filter(member => 
        member.name && member.email && member.phone && member.role
      )

      const dataToSubmit = {
        ...formData,
        members: cleanedMembers,
        robotWeight: parseFloat(formData.robotWeight.toString()),
        userId: (session as Session).user.id
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      router.push(`/registration/success?order_id=${result.payment.id}`)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Team Details', icon: Users },
    { id: 2, title: 'Robot Details', icon: Bot },
    { id: 3, title: 'Team Members', icon: School }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${
                currentStep === step.id ? 'text-turquoise' : 'text-gray-400'
              }`}
            >
              <step.icon className="w-6 h-6 mr-2" />
              <span>{step.title}</span>
            </div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-black/20 p-8 rounded-lg border border-white/10"
        >
          {/* Step 1: Team Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
                <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-white/60 mb-1">
                  Team Name *
                  </label>
                  <input
                    type="text"
                  id="teamName"
                    name="teamName"
                    value={formData.teamName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter team name"
                  />
                </div>

                <div>
                <label htmlFor="institution" className="block text-sm font-medium text-white/60 mb-1">
                  Institution *
                  </label>
                  <input
                    type="text"
                  id="institution"
                    name="institution"
                    value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-white/60 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-white/60 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter contact phone"
                />
              </div>

              <div>
                <label htmlFor="leaderName" className="block text-sm font-medium text-white/60 mb-1">
                  Team Leader Name *
                </label>
                <input
                  type="text"
                  id="leaderName"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter team leader name"
                  />
                </div>

                <div>
                <label htmlFor="leaderEmail" className="block text-sm font-medium text-white/60 mb-1">
                  Team Leader Email *
                  </label>
                  <input
                    type="email"
                  id="leaderEmail"
                  name="leaderEmail"
                  value={formData.leaderEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter team leader email"
                  />
                </div>

                <div>
                <label htmlFor="leaderPhone" className="block text-sm font-medium text-white/60 mb-1">
                  Team Leader Phone *
                  </label>
                  <input
                  type="tel"
                  id="leaderPhone"
                  name="leaderPhone"
                  value={formData.leaderPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter team leader phone"
                  />
                </div>
            </div>
          )}

          {/* Step 2: Robot Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="robotName" className="block text-sm font-medium text-white/60 mb-1">
                  Robot Name *
                </label>
                <input
                  type="text"
                  id="robotName"
                  name="robotName"
                  value={formData.robotName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter robot name"
                />
              </div>

              <div>
                <label htmlFor="robotWeight" className="block text-sm font-medium text-white/60 mb-1">
                  Robot Weight (kg) *
                </label>
                <input
                  type="number"
                  id="robotWeight"
                  name="robotWeight"
                  value={formData.robotWeight}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter robot weight"
                />
              </div>

              <div>
                <label htmlFor="robotDimensions" className="block text-sm font-medium text-white/60 mb-1">
                  Robot Dimensions (LxWxH cm) *
                </label>
                <input
                  type="text"
                  id="robotDimensions"
                  name="robotDimensions"
                  value={formData.robotDimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="e.g., 30x20x15"
                />
              </div>

                <div>
                <label htmlFor="weaponType" className="block text-sm font-medium text-white/60 mb-1">
                  Weapon Type *
                  </label>
                <input
                  type="text"
                  id="weaponType"
                  name="weaponType"
                  value={formData.weaponType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                  placeholder="Enter weapon type"
                />
              </div>
            </div>
          )}

          {/* Step 3: Team Members */}
          {currentStep === 3 && (
            <div className="space-y-6">
                  {formData.members.map((member, index) => (
                <div key={index} className="space-y-4 p-4 border border-white/10 rounded-lg">
                  <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
                  
                  <div>
                    <label htmlFor={`member-${index}-name`} className="block text-sm font-medium text-white/60 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id={`member-${index}-name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                      placeholder="Enter member name"
                    />
                  </div>

                  <div>
                    <label htmlFor={`member-${index}-email`} className="block text-sm font-medium text-white/60 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id={`member-${index}-email`}
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                      placeholder="Enter member email"
                    />
                </div>

                <div>
                    <label htmlFor={`member-${index}-phone`} className="block text-sm font-medium text-white/60 mb-1">
                      Phone *
                  </label>
                  <input
                    type="tel"
                      id={`member-${index}-phone`}
                      value={member.phone}
                      onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                      placeholder="Enter member phone"
                    />
                  </div>

                  <div>
                    <label htmlFor={`member-${index}-role`} className="block text-sm font-medium text-white/60 mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      id={`member-${index}-role`}
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise text-white"
                      placeholder="Enter member role"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
                <button
                  type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Previous
                </button>
              )}
            {currentStep < 3 ? (
                <button
                  type="button"
                onClick={() => {
                  if (validateForm()) setCurrentStep(prev => prev + 1)
                }}
                className="px-4 py-2 text-sm bg-gradient-to-r from-vibrant-orange to-turquoise rounded-lg hover:opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                className="px-4 py-2 text-sm bg-gradient-to-r from-vibrant-orange to-turquoise rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Submit Registration'
                )}
                </button>
              )}
            </div>
        </motion.form>
      </div>
    </div>
  )
}

