'use client'

import { useState } from 'react'
import { Loader2, Plus, X } from 'lucide-react'

interface TeamFormData {
  teamName: string
  institution: string
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

interface EditTeamFormProps {
  initialData: TeamFormData
  onSubmit: (data: TeamFormData) => Promise<void>
  onCancel: () => void
}

export function EditTeamForm({ initialData, onSubmit, onCancel }: EditTeamFormProps) {
  const [formData, setFormData] = useState<TeamFormData>(initialData)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'robotWeight' ? parseFloat(value) : value
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

  const addMember = () => {
    if (formData.members.length < 6) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { name: '', email: '', phone: '', role: '' }]
      }))
    }
  }

  const removeMember = (index: number) => {
    if (formData.members.length > 3) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h2 className="text-2xl font-bold text-[#00CED1]">Edit Team Details</h2>
      
      {/* Team & Leader Details (Read-only) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80">Team Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.teamName}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/40"
            disabled
          />
          <input
            type="text"
            value={formData.institution}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/40"
            disabled
          />
        </div>
      </div>

      {/* Leader Details (Read-only) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80">Team Leader</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={formData.leaderName}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/40"
            disabled
          />
          <input
            type="email"
            value={formData.leaderEmail}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/40"
            disabled
          />
          <input
            type="tel"
            value={formData.leaderPhone}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/40"
            disabled
          />
        </div>
      </div>

      {/* Robot Details (Editable) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80">Robot Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="robotName"
            placeholder="Robot Name"
            value={formData.robotName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
          />
          <input
            type="number"
            name="robotWeight"
            placeholder="Weight (kg)"
            value={formData.robotWeight}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
          />
          <input
            type="text"
            name="robotDimensions"
            placeholder="Dimensions"
            value={formData.robotDimensions}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
          />
          <input
            type="text"
            name="weaponType"
            placeholder="Weapon Type"
            value={formData.weaponType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Team Members (Editable) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80">Team Members</h3>
        {formData.members.map((member, index) => (
          <div key={index} className="relative p-4 bg-white/5 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
              />
              <input
                type="email"
                placeholder="Email"
                value={member.email}
                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={member.phone}
                onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[#00CED1] text-white placeholder-white/40"
              />
            </div>
            {formData.members.length > 3 && (
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="absolute -right-2 -top-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        {formData.members.length < 6 && (
          <button
            type="button"
            onClick={addMember}
            className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg hover:border-[#00CED1] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-white/70 hover:text-white"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#00CED1] text-white rounded-lg hover:bg-[#00CED1]/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
} 