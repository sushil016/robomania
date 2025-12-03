'use client'

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

const COMPETITIONS = [
  { id: 'ROBOWARS', name: 'RoboWars', description: 'Robot combat arena - Battle your way to victory', price: 300, icon: '⚔️', requiresRobot: true },
  { id: 'ROBORACE', name: 'RoboRace', description: 'High-speed racing through challenging tracks', price: 200, icon: '🏎️', requiresRobot: true },
  { id: 'ROBOSOCCER', name: 'RoboSoccer', description: '2v2 robot soccer championship', price: 200, icon: '⚽', requiresRobot: true }
]

type TeamData = {
  teamName: string
  institution: string
  contactEmail: string
  contactPhone: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  members: { name: string; email: string; phone: string; role: string }[]
}

type RobotData = { robotName: string; robotWeight: string; robotDimensions: string; weaponType: string }

type ExistingRegistration = { competition: string; status: string; payment_status: string }

export default function TeamRegistration() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [hasExistingTeam, setHasExistingTeam] = useState(false)
  const [existingTeamId, setExistingTeamId] = useState<string | null>(null)
  const [existingRegistrations, setExistingRegistrations] = useState<ExistingRegistration[]>([])
  
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([])
  
  const [teamData, setTeamData] = useState<TeamData>({
    teamName: '', institution: '', contactEmail: '', contactPhone: '',
    leaderName: '', leaderEmail: '', leaderPhone: '',
    members: [
      { name: '', email: '', phone: '', role: '' },
      { name: '', email: '', phone: '', role: '' },
      { name: '', email: '', phone: '', role: '' }
    ]
  })
  
  const [robotDetails, setRobotDetails] = useState<Record<string, RobotData>>({
    ROBOWARS: { robotName: '', robotWeight: '', robotDimensions: '', weaponType: '' },
    ROBORACE: { robotName: '', robotWeight: '', robotDimensions: '', weaponType: 'N/A' },
    ROBOSOCCER: { robotName: '', robotWeight: '', robotDimensions: '', weaponType: 'N/A' }
  })

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      const s = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (s) document.body.removeChild(s)
    }
  }, [])

  useEffect(() => {
    const checkExisting = async () => {
      if (status === 'loading') return
      if (!session?.user?.email) { setLoading(false); return }

      try {
        const response = await fetch('/api/team-details')
        if (response.ok) {
          const data = await response.json()
          if (data.team) {
            setHasExistingTeam(true)
            setExistingTeamId(data.team.id)
            setTeamData({
              teamName: data.team.teamName || '', institution: data.team.institution || '',
              contactEmail: data.team.contactDetails?.email || '', contactPhone: data.team.contactDetails?.phone || '',
              leaderName: data.team.leader?.name || '', leaderEmail: data.team.leader?.email || '', leaderPhone: data.team.leader?.phone || '',
              members: data.team.members?.length > 0 ? data.team.members : [
                { name: '', email: '', phone: '', role: '' },
                { name: '', email: '', phone: '', role: '' },
                { name: '', email: '', phone: '', role: '' }
              ]
            })
          }
        }
        const regResponse = await fetch('/api/competition-registrations')
        if (regResponse.ok) {
          const regData = await regResponse.json()
          setExistingRegistrations(regData.registrations || [])
        }
      } catch (err) { console.error('Error checking existing:', err) }
      finally { setLoading(false) }
    }
    checkExisting()
  }, [session, status])

  useEffect(() => {
    if (session?.user?.email && !teamData.contactEmail) {
      setTeamData(prev => ({ ...prev, contactEmail: session.user?.email || '' }))
    }
  }, [session, teamData.contactEmail])

  const isCompetitionRegistered = (compId: string) => existingRegistrations.some(r => r.competition === compId)
  
  const toggleCompetition = (compId: string) => {
    if (isCompetitionRegistered(compId)) return
    setSelectedCompetitions(prev => prev.includes(compId) ? prev.filter(c => c !== compId) : [...prev, compId])
  }

  const getTotalAmount = () => selectedCompetitions.reduce((total, compId) => total + (COMPETITIONS.find(c => c.id === compId)?.price || 0), 0)

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeamData(prev => ({ ...prev, [name]: value }))
  }

  const handleMemberChange = (index: number, field: string, value: string) => {
    setTeamData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => i === index ? { ...member, [field]: value } : member)
    }))
  }

  const handleRobotChange = (compId: string, field: string, value: string) => {
    setRobotDetails(prev => ({ ...prev, [compId]: { ...prev[compId], [field]: value } }))
  }

  const addMember = () => {
    if (teamData.members.length < 6) {
      setTeamData(prev => ({ ...prev, members: [...prev.members, { name: '', email: '', phone: '', role: '' }] }))
    }
  }

  const removeMember = (index: number) => {
    if (teamData.members.length > 3) {
      setTeamData(prev => ({ ...prev, members: prev.members.filter((_, i) => i !== index) }))
    }
  }

  const validateStep = (step: number) => {
    setError('')
    if (step === 1 && selectedCompetitions.length === 0) {
      setError('Please select at least one competition')
      return false
    }
    if (step === 2 && !hasExistingTeam) {
      if (!teamData.teamName || !teamData.institution) { setError('Team name and institution are required'); return false }
      if (!teamData.leaderName || !teamData.leaderEmail || !teamData.leaderPhone) { setError('Leader details are required'); return false }
      if (!teamData.contactEmail || !teamData.contactPhone) { setError('Contact details are required'); return false }
      const validMembers = teamData.members.filter(m => m.name && m.email && m.phone && m.role)
      if (validMembers.length < 3) { setError('At least 3 team members with complete details are required'); return false }
    }
    if (step === 3) {
      for (const compId of selectedCompetitions) {
        const robot = robotDetails[compId]
        if (!robot.robotName || !robot.robotWeight || !robot.robotDimensions) {
          const comp = COMPETITIONS.find(c => c.id === compId)
          setError('Robot details for ' + (comp?.name || compId) + ' are required')
          return false
        }
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1 && hasExistingTeam) { setCurrentStep(3) }
      else { setCurrentStep(prev => Math.min(prev + 1, 4)) }
    }
  }

  const prevStep = () => {
    if (currentStep === 3 && hasExistingTeam) { setCurrentStep(1) }
    else { setCurrentStep(prev => Math.max(prev - 1, 1)) }
  }

  const handleSubmit = async (payNow: boolean = true) => {
    if (!validateStep(3)) return
    if (!session?.user?.email) { setError('You must be logged in to register'); return }
    setSubmitting(true)
    setError('')

    try {
      let teamId = existingTeamId
      
      // Always register/update team first
      const teamResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamData, userEmail: session.user.email,
          robotName: robotDetails[selectedCompetitions[0]]?.robotName || '',
          robotWeight: robotDetails[selectedCompetitions[0]]?.robotWeight || '',
          robotDimensions: robotDetails[selectedCompetitions[0]]?.robotDimensions || '',
          weaponType: robotDetails[selectedCompetitions[0]]?.weaponType || 'N/A'
        })
      })
      
      const teamResult = await teamResponse.json()
      if (!teamResponse.ok) { 
        throw new Error(teamResult.message || 'Failed to register team') 
      }
      teamId = teamResult.team.id

      // If user chose "Pay Later", redirect to dashboard with pending status
      if (!payNow) {
        router.push('/dashboard?status=pending')
        return
      }

      // Proceed with payment
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          competitions: selectedCompetitions.map(compId => ({
            competition: compId,
            amount: COMPETITIONS.find(c => c.id === compId)?.price || 0,
            robotDetails: robotDetails[compId]
          })),
          amount: getTotalAmount()
        })
      })
      
      if (!orderResponse.ok) { 
        const err = await orderResponse.json()
        // If payment fails, still save as draft and offer to pay later
        setError('Payment setup failed. Your registration is saved. You can pay later from your dashboard.')
        setTimeout(() => router.push('/dashboard?status=pending'), 3000)
        return
      }
      
      const orderResult = await orderResponse.json()
      const competitionNames = selectedCompetitions.map(c => COMPETITIONS.find(comp => comp.id === c)?.name).join(', ')

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: 'INR',
        name: 'RoboMania 2025',
        description: 'Registration: ' + competitionNames,
        order_id: orderResult.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderResult.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                competitions: selectedCompetitions,
                teamId
              })
            })
            if (verifyResponse.ok) { router.push('/dashboard?status=success') }
            else { setError('Payment verification failed. Contact support.') }
          } catch { setError('Payment verification failed. Contact support.') }
        },
        modal: {
          ondismiss: () => {
            // User closed payment modal - registration saved as draft
            setError('Payment cancelled. Your registration is saved as draft. You can pay later from your dashboard.')
            setTimeout(() => router.push('/dashboard?status=pending'), 3000)
          }
        },
        prefill: { email: teamData.contactEmail, contact: teamData.contactPhone },
        theme: { color: '#3b82f6' }
      })
      razorpay.open()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
    } finally { setSubmitting(false) }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center px-4">
        <div className="bg-theme-bg-card border border-theme-border rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-theme-text mb-4">Sign In Required</h2>
          <p className="text-theme-text-secondary mb-6">Please sign in to register your team for RoboMania 2025</p>
          <a href="/auth/login" className="inline-block px-6 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-xl transition-colors">Sign In</a>
        </div>
      </div>
    )
  }

  const steps = hasExistingTeam 
    ? [{ id: 1, title: 'Select Events', icon: '🎯' }, { id: 3, title: 'Robot Details', icon: '🤖' }, { id: 4, title: 'Review & Pay', icon: '💳' }]
    : [{ id: 1, title: 'Select Events', icon: '🎯' }, { id: 2, title: 'Team Details', icon: '👥' }, { id: 3, title: 'Robot Details', icon: '🤖' }, { id: 4, title: 'Review & Pay', icon: '💳' }]

  const getStepClass = (stepId: number) => {
    const base = 'flex items-center justify-center w-10 h-10 rounded-full text-lg '
    return base + (currentStep >= stepId ? 'bg-theme-accent text-white' : 'bg-theme-bg-secondary text-theme-text-muted border border-theme-border')
  }

  const getCompCardClass = (compId: string) => {
    const isRegistered = isCompetitionRegistered(compId)
    const isSelected = selectedCompetitions.includes(compId)
    const base = 'relative p-5 rounded-xl border-2 transition-all cursor-pointer '
    if (isRegistered) return base + 'bg-green-500/10 border-green-500/30 cursor-not-allowed'
    if (isSelected) return base + 'bg-theme-accent/10 border-theme-accent'
    return base + 'bg-theme-bg-secondary border-theme-border hover:border-theme-accent/50'
  }

  return (
    <div className="min-h-screen bg-theme-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text mb-2">
            {hasExistingTeam ? 'Register for More Events' : 'Team Registration'}
          </h1>
          <p className="text-theme-text-secondary">
            {hasExistingTeam ? 'Welcome back, ' + teamData.teamName + '! Select additional competitions to join.' : 'Register your team for RoboMania 2025 competitions'}
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={getStepClass(step.id)}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={'w-12 h-0.5 mx-2 ' + (currentStep > step.id ? 'bg-theme-accent' : 'bg-theme-border')} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">{error}</div>
        )}

        <div className="bg-theme-bg-card border border-theme-border rounded-2xl p-6 md:p-8">
          
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-theme-text mb-6">Select Competitions</h2>
              <div className="grid gap-4">
                {COMPETITIONS.map(comp => {
                  const isRegistered = isCompetitionRegistered(comp.id)
                  const isSelected = selectedCompetitions.includes(comp.id)
                  return (
                    <div key={comp.id} onClick={() => toggleCompetition(comp.id)} className={getCompCardClass(comp.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{comp.icon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-theme-text">{comp.name}</h3>
                            <p className="text-sm text-theme-text-muted">{comp.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1 text-green-400 text-sm"><Check className="w-4 h-4" /> Registered</span>
                          ) : (
                            <><p className="text-xl font-bold text-theme-text">₹{comp.price}</p><p className="text-xs text-theme-text-muted">per team</p></>
                          )}
                        </div>
                      </div>
                      {isSelected && !isRegistered && <div className="absolute top-3 right-3"><Check className="w-5 h-5 text-theme-accent" /></div>}
                    </div>
                  )
                })}
              </div>
              {selectedCompetitions.length > 0 && (
                <div className="mt-6 p-4 bg-theme-bg-secondary rounded-xl flex justify-between items-center">
                  <span className="text-theme-text-secondary">{selectedCompetitions.length} competition{selectedCompetitions.length > 1 ? 's' : ''} selected</span>
                  <span className="text-xl font-bold text-theme-text">Total: ₹{getTotalAmount()}</span>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && !hasExistingTeam && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4">Team Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="teamName" placeholder="Team Name *" value={teamData.teamName} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                <input type="text" name="institution" placeholder="Institution/College *" value={teamData.institution} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" name="contactEmail" placeholder="Contact Email *" value={teamData.contactEmail} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                <input type="tel" name="contactPhone" placeholder="Contact Phone *" value={teamData.contactPhone} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
              </div>
              <h3 className="text-lg font-medium text-theme-text pt-4">Team Leader</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="leaderName" placeholder="Leader Name *" value={teamData.leaderName} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                <input type="email" name="leaderEmail" placeholder="Leader Email *" value={teamData.leaderEmail} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                <input type="tel" name="leaderPhone" placeholder="Leader Phone *" value={teamData.leaderPhone} onChange={handleTeamInputChange} className="w-full px-4 py-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
              </div>
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-theme-text">Team Members (Min 3, Max 6)</h3>
                  {teamData.members.length < 6 && <button type="button" onClick={addMember} className="text-sm text-theme-accent hover:text-theme-accent-hover">+ Add Member</button>}
                </div>
                <div className="space-y-4">
                  {teamData.members.map((member, index) => (
                    <div key={index} className="p-4 bg-theme-bg-secondary rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-theme-text-muted">Member {index + 1}</span>
                        {teamData.members.length > 3 && <button type="button" onClick={() => removeMember(index)} className="text-sm text-red-400 hover:text-red-300">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" placeholder="Name *" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-theme-bg-card border border-theme-border rounded-lg text-theme-text placeholder-theme-text-muted text-sm focus:outline-none focus:border-theme-accent" />
                        <input type="email" placeholder="Email *" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} className="w-full px-3 py-2 bg-theme-bg-card border border-theme-border rounded-lg text-theme-text placeholder-theme-text-muted text-sm focus:outline-none focus:border-theme-accent" />
                        <input type="tel" placeholder="Phone *" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} className="w-full px-3 py-2 bg-theme-bg-card border border-theme-border rounded-lg text-theme-text placeholder-theme-text-muted text-sm focus:outline-none focus:border-theme-accent" />
                        <input type="text" placeholder="Role *" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} className="w-full px-3 py-2 bg-theme-bg-card border border-theme-border rounded-lg text-theme-text placeholder-theme-text-muted text-sm focus:outline-none focus:border-theme-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4">Robot Details</h2>
              <p className="text-theme-text-secondary text-sm mb-6">Enter robot specifications for each competition you selected.</p>
              {selectedCompetitions.map(compId => {
                const comp = COMPETITIONS.find(c => c.id === compId)
                const robot = robotDetails[compId]
                return (
                  <div key={compId} className="p-5 bg-theme-bg-secondary rounded-xl border border-theme-border">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{comp?.icon}</span>
                      <h3 className="text-lg font-semibold text-theme-text">{comp?.name} Robot</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Robot Name *" value={robot.robotName} onChange={(e) => handleRobotChange(compId, 'robotName', e.target.value)} className="w-full px-4 py-3 bg-theme-bg-card border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                      <input type="text" placeholder="Weight (kg) *" value={robot.robotWeight} onChange={(e) => handleRobotChange(compId, 'robotWeight', e.target.value)} className="w-full px-4 py-3 bg-theme-bg-card border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                      <input type="text" placeholder="Dimensions (LxWxH cm) *" value={robot.robotDimensions} onChange={(e) => handleRobotChange(compId, 'robotDimensions', e.target.value)} className="w-full px-4 py-3 bg-theme-bg-card border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />
                      {compId === 'ROBOWARS' && <input type="text" placeholder="Weapon Type *" value={robot.weaponType} onChange={(e) => handleRobotChange(compId, 'weaponType', e.target.value)} className="w-full px-4 py-3 bg-theme-bg-card border border-theme-border rounded-xl text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent" />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4">Review & Confirm</h2>
              <div className="p-5 bg-theme-bg-secondary rounded-xl">
                <h3 className="text-lg font-medium text-theme-text mb-3">Team Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-theme-text-muted">Team Name:</span><span className="text-theme-text">{teamData.teamName}</span>
                  <span className="text-theme-text-muted">Institution:</span><span className="text-theme-text">{teamData.institution}</span>
                  <span className="text-theme-text-muted">Leader:</span><span className="text-theme-text">{teamData.leaderName}</span>
                  <span className="text-theme-text-muted">Members:</span><span className="text-theme-text">{teamData.members.filter(m => m.name).length} members</span>
                </div>
              </div>
              <div className="p-5 bg-theme-bg-secondary rounded-xl">
                <h3 className="text-lg font-medium text-theme-text mb-3">Selected Competitions</h3>
                <div className="space-y-3">
                  {selectedCompetitions.map(compId => {
                    const comp = COMPETITIONS.find(c => c.id === compId)
                    const robot = robotDetails[compId]
                    return (
                      <div key={compId} className="flex justify-between items-center p-3 bg-theme-bg-card rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{comp?.icon}</span>
                          <div><p className="text-theme-text font-medium">{comp?.name}</p><p className="text-xs text-theme-text-muted">Robot: {robot.robotName}</p></div>
                        </div>
                        <span className="text-theme-text font-semibold">₹{comp?.price}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-theme-border flex justify-between items-center">
                  <span className="text-theme-text font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-theme-accent">₹{getTotalAmount()}</span>
                </div>
              </div>
              <p className="text-xs text-theme-text-muted text-center">By proceeding, you agree to our terms and conditions. Registration fee is non-refundable.</p>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-theme-border">
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-theme-text-secondary hover:text-theme-text transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            
            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-xl transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => handleSubmit(false)} 
                  disabled={submitting} 
                  className="flex items-center gap-2 px-6 py-3 border border-theme-border text-theme-text hover:bg-theme-bg-secondary rounded-xl transition-colors disabled:opacity-50"
                >
                  Save & Pay Later
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSubmit(true)} 
                  disabled={submitting} 
                  className="flex items-center gap-2 px-8 py-3 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Pay ₹{getTotalAmount()}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
