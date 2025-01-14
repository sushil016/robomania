'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2, Users, Bot, School } from 'lucide-react'

type FormData = {
  teamName: string
  institution: string
  contactEmail: string
  contactPhone: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  robotName: string
  robotWeight: number
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
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    institution: '',
    contactEmail: '',
    contactPhone: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    robotName: '',
    robotWeight: 0,
    robotDimensions: '',
    weaponType: '',
    members: [
      { name: '', email: '', phone: '', role: '' },
      { name: '', email: '', phone: '', role: '' },
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }

      router.push('/registration/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Team Details', icon: Users },
    { id: 2, title: 'Robot Details', icon: Bot },
    { id: 3, title: 'Team Members', icon: School }
  ]

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

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="teamName"
          placeholder="Team Name"
          value={formData.teamName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
        <input
          type="text"
          name="institution"
          placeholder="Institution"
          value={formData.institution}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          name="contactEmail"
          placeholder="Contact Email"
          value={formData.contactEmail}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
        <input
          type="tel"
          name="contactPhone"
          placeholder="Contact Phone"
          value={formData.contactPhone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="leaderName"
          placeholder="Team Leader Name"
          value={formData.leaderName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
        <input
          type="email"
          name="leaderEmail"
          placeholder="Team Leader Email"
          value={formData.leaderEmail}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
        <input
          type="tel"
          name="leaderPhone"
          placeholder="Team Leader Phone"
          value={formData.leaderPhone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="robotName"
          placeholder="Robot Name"
          value={formData.robotName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
        <input
          type="number"
          name="robotWeight"
          placeholder="Robot Weight (kg)"
          value={formData.robotWeight || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
          required
        />
      </div>

      <input
        type="text"
        name="robotDimensions"
        placeholder="Robot Dimensions (LxWxH in cm)"
        value={formData.robotDimensions}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
        required
      />

      <select
        name="weaponType"
        value={formData.weaponType}
        onChange={(e) => setFormData(prev => ({ ...prev, weaponType: e.target.value }))}
        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
        required
      >
        <option value="">Select Weapon Type</option>
        <option value="spinner">Spinner</option>
        <option value="flipper">Flipper</option>
        <option value="crusher">Crusher</option>
        <option value="hammer">Hammer</option>
        <option value="other">Other</option>
      </select>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {formData.members.map((member, index) => (
        <div key={index} className="p-4 border border-white/10 rounded-lg space-y-4">
          <h3 className="text-white/90 font-medium">Team Member {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={member.email}
              onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={member.phone}
              onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1]"
              required
            />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen py-36 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-orbitron mb-4 bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
            Register Your Team
          </h1>
          <p className="text-white/60">
            Join the ultimate robot battle competition
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step.id 
                    ? 'border-[#00CED1] text-[#00CED1]' 
                    : 'border-white/20 text-white/20'
                  }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-20 h-0.5 mx-2 
                    ${currentStep > step.id ? 'bg-[#00CED1]' : 'bg-white/20'}`
                  } 
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-lg ml-auto"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-lg ml-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

