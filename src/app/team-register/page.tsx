'use client'

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ChevronRight, ChevronLeft, AlertCircle, Save } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ModernStepIndicator } from '@/components/ModernStepIndicator'
import { CompetitionCard } from './components/CompetitionCard'
import { TeamForm } from './components/TeamForm'
import { RobotForm } from './components/RobotForm'
import { ReviewSummary } from './components/ReviewSummary'
import { LoadingState } from './components/LoadingState'
import { StepTransition } from './components/StepTransition'
import { CompetitionPreview } from './components/CompetitionPreview'
import { PaymentOptions } from './components/PaymentOptions'
import { SuccessCelebration } from './components/SuccessCelebration'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { useStepValidation } from '@/hooks/useStepValidation'
import { calculateTotal } from '@/lib/validation'
import { getAutoFillData, saveInstitution } from '@/lib/autoFill'
import { announceToScreenReader, focusFirstError, prefersReducedMotion } from '@/lib/accessibility'

const COMPETITIONS = [
  { 
    id: 'robowars', 
    name: 'RoboWars', 
    description: 'Robot combat arena - Battle your way to victory', 
    price: 300, 
    slug: 'robowars',
    maxWeight: 8,
    teamSize: '2-5',
    prizePool: '₹39,000'
  },
  { 
    id: 'roborace', 
    name: 'RoboRace', 
    description: 'High-speed racing through challenging tracks', 
    price: 200, 
    slug: 'roborace',
    maxWeight: 5,
    teamSize: '2-4',
    prizePool: '₹20,000'
  },
  { 
    id: 'robosoccer', 
    name: 'RoboSoccer', 
    description: '2v2 robot soccer championship', 
    price: 200, 
    slug: 'robosoccer',
    maxWeight: 3,
    teamSize: '2-4',
    prizePool: '₹20,000'
  }
]

const STEP_LABELS = ['Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']

const STEP_DATA = [
  {
    number: 1,
    title: 'Select Competitions',
    description: 'Choose which events you want to participate in'
  },
  {
    number: 2,
    title: 'Team Details',
    description: 'Enter your team information and members'
  },
  {
    number: 3,
    title: 'Robot Details',
    description: 'Provide specifications for each robot'
  },
  {
    number: 4,
    title: 'Review & Payment',
    description: 'Confirm details and complete registration'
  }
]

type TeamMember = {
  name: string
  email: string
  phone: string
  role: string
}

type RobotDetail = {
  robotName: string
  weight: string
  dimensions: string
  weaponType?: string
}

type FormData = {
  selectedCompetitions: string[]
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  institution: string
  teamMembers: TeamMember[]
  robotDetails: Record<string, RobotDetail>
}

export default function TeamRegistration() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [hasExistingTeam, setHasExistingTeam] = useState(false)
  const [existingTeamId, setExistingTeamId] = useState<string | null>(null)
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  
  // Preview state
  const [previewCompetition, setPreviewCompetition] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedCompetitions: [],
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    institution: '',
    teamMembers: [],
    robotDetails: {}
  })

  // Custom hooks
  const { 
    validateStep1, 
    validateStep2, 
    validateStep3, 
    getFieldError, 
    clearErrors,
    removeFieldError,
    errors: validationErrors
  } = useStepValidation()
  
  const { saveToStorage, loadFromStorage, clearStorage, hasDraft } = useFormPersistence(formData, !hasExistingTeam)

  // Load draft on mount
  useEffect(() => {
    if (!hasExistingTeam && hasDraft()) {
      setShowDraftPrompt(true)
    }
  }, [hasExistingTeam, hasDraft])

  // Check authentication and existing team
  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return

      if (!session?.user) {
        router.push('/auth/login?callbackUrl=/team-register')
        return
      }

      // Smart auto-fill from session and localStorage
      const autoFillData = getAutoFillData(session)
      if (autoFillData) {
        setFormData(prev => ({
          ...prev,
          leaderEmail: autoFillData.leaderEmail || prev.leaderEmail,
          leaderName: autoFillData.leaderName || prev.leaderName,
          institution: autoFillData.institution || prev.institution,
        }))
      }

      // Check for existing team
      try {
        const response = await fetch('/api/check-registration')
        const data = await response.json()
        
        if (data.hasRegistered && data.teamId) {
          setHasExistingTeam(true)
          setExistingTeamId(data.teamId)
          
          // Pre-fill team name from existing team
          if (data.teamName) {
            setFormData(prev => ({
              ...prev,
              teamName: data.teamName
            }))
          }
        } else if (session?.user?.email) {
          // If no team yet, try to fetch team name from previous registration
          try {
            const teamNameResponse = await fetch(`/api/team-details/name?email=${session.user.email}`)
            const teamNameData = await teamNameResponse.json()
            
            if (teamNameData.success && teamNameData.hasTeam && teamNameData.teamName) {
              // Pre-fill team name from previous registration
              setFormData(prev => ({
                ...prev,
                teamName: teamNameData.teamName
              }))
            }
          } catch (err) {
            console.log('No previous team name found')
          }
        }
      } catch (err) {
        console.error('Failed to check registration:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [session, status, router])

  // Auto-save indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasExistingTeam && formData.selectedCompetitions.length > 0) {
        setAutoSaving(true)
        setTimeout(() => setAutoSaving(false), 1000)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData, hasExistingTeam])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key - close modals
      if (e.key === 'Escape') {
        if (previewCompetition) {
          setPreviewCompetition(null)
        }
        if (showDraftPrompt) {
          setShowDraftPrompt(false)
        }
      }

      // Arrow keys for navigation (only when not typing)
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        if (e.key === 'ArrowRight' && currentStep < 4 && !submitting) {
          e.preventDefault()
          handleNextStep()
        } else if (e.key === 'ArrowLeft' && currentStep > 1 && !submitting) {
          e.preventDefault()
          handlePrevStep()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, submitting, previewCompetition, showDraftPrompt])

  const loadDraft = () => {
    const draft = loadFromStorage()
    if (draft) {
      setFormData(draft)
      setShowDraftPrompt(false)
    }
  }

  const discardDraft = () => {
    clearStorage()
    setShowDraftPrompt(false)
  }

  const handleCompetitionToggle = (competitionId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedCompetitions.includes(competitionId)
      const updated = isSelected
        ? prev.selectedCompetitions.filter(id => id !== competitionId)
        : [...prev.selectedCompetitions, competitionId]
      
      // Initialize robot details for newly selected competitions
      const newRobotDetails = { ...prev.robotDetails }
      if (!isSelected) {
        newRobotDetails[competitionId] = {
          robotName: '',
          weight: '',
          dimensions: '',
          weaponType: competitionId === 'robowars' ? '' : undefined
        }
      } else {
        delete newRobotDetails[competitionId]
      }

      return {
        ...prev,
        selectedCompetitions: updated,
        robotDetails: newRobotDetails
      }
    })
    removeFieldError('competitions')
  }

  const handleTeamDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Save institution to localStorage for future use
    if (field === 'institution' && value) {
      saveInstitution(value)
    }
  }

  const handleRobotDetailChange = (competition: string, field: keyof RobotDetail, value: string) => {
    setFormData(prev => ({
      ...prev,
      robotDetails: {
        ...prev.robotDetails,
        [competition]: {
          ...prev.robotDetails[competition],
          [field]: value
        }
      }
    }))
  }

  const handleNextStep = () => {
    clearErrors()
    
    // Validate current step
    let isValid = false
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1(formData.selectedCompetitions)
        break
      case 2:
        isValid = validateStep2({
          teamName: formData.teamName,
          leaderName: formData.leaderName,
          leaderEmail: formData.leaderEmail,
          leaderPhone: formData.leaderPhone,
          institution: formData.institution,
          teamMembers: formData.teamMembers
        })
        break
      case 3:
        isValid = validateStep3(formData.robotDetails)
        break
      default:
        isValid = true
    }

    if (isValid) {
      setStepDirection('forward')
      const nextStep = Math.min(currentStep + 1, 4)
      setCurrentStep(nextStep)
      
      // Announce step change to screen readers
      const stepNames = ['', 'Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']
      announceToScreenReader(`Moved to step ${nextStep}: ${stepNames[nextStep]}`)
      
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    } else {
      setError('Please fill in all required fields correctly')
      
      // Announce validation errors to screen readers
      announceToScreenReader('Validation failed. Please check the form for errors.')
      
      // Focus first error field after a brief delay
      setTimeout(() => focusFirstError(validationErrors), 100)
      
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setStepDirection('backward')
    const prevStep = Math.max(currentStep - 1, 1)
    setCurrentStep(prevStep)
    clearErrors()
    
    // Announce step change to screen readers
    const stepNames = ['', 'Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']
    announceToScreenReader(`Moved back to step ${prevStep}: ${stepNames[prevStep]}`)
    
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const handleEditStep = (step: number) => {
    setStepDirection(step < currentStep ? 'backward' : 'forward')
    setCurrentStep(step)
    
    // Announce step change to screen readers
    const stepNames = ['', 'Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']
    announceToScreenReader(`Editing step ${step}: ${stepNames[step]}`)
    
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const handleSubmit = async (paymentMethod: 'now' | 'later') => {
    setSubmitting(true)
    setError('')

    try {
      // Create order with Razorpay
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitions: formData.selectedCompetitions,
          teamData: {
            teamName: formData.teamName,
            leaderName: formData.leaderName,
            leaderEmail: formData.leaderEmail,
            leaderPhone: formData.leaderPhone,
            institution: formData.institution,
            teamMembers: formData.teamMembers
          },
          robotDetails: formData.robotDetails,
          paymentMethod
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create registration')
      }

      if (paymentMethod === 'later') {
        // Save as draft and redirect to dashboard
        clearStorage()
        router.push('/dashboard?registered=pending')
        return
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Robomania 2025',
        description: 'Competition Registration',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: orderData.registrationId
            })
          })

          if (verifyResponse.ok) {
            clearStorage()
            setShowSuccess(true)
          } else {
            setError('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: formData.leaderName,
          email: formData.leaderEmail,
          contact: formData.leaderPhone
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false)
            setError('Payment cancelled. Your registration has been saved as draft.')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading registration form..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Registration</h1>
          <p className="text-gray-600">Complete your registration for Robomania 2025</p>
          <p className="text-sm text-gray-500 mt-2">
            Tip: Use arrow keys (← →) to navigate between steps
          </p>
          {autoSaving && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
              <Save className="w-4 h-4" />
              <span>Draft saved automatically</span>
            </div>
          )}
        </div>

        {/* Draft Prompt */}
        {showDraftPrompt && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Resume Previous Registration?</h3>
                <p className="text-sm text-blue-700">We found a saved draft of your registration.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadDraft}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Load Draft
                </button>
                <button
                  onClick={discardDraft}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <ModernStepIndicator 
            currentStep={currentStep} 
            steps={STEP_DATA}
          />

          {/* Step Content with Animations */}
          <div className="mt-8">
            <StepTransition currentStep={currentStep} direction={stepDirection}>
              {/* Step 1: Select Competitions */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COMPETITIONS.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                        isSelected={formData.selectedCompetitions.includes(competition.id)}
                        onToggle={() => handleCompetitionToggle(competition.id)}
                        onPreview={() => setPreviewCompetition(competition.slug)}
                      />
                    ))}
                  </div>
                  {getFieldError('competitions') && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError('competitions')}</span>
                    </div>
                  )}
                  {formData.selectedCompetitions.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{calculateTotal(formData.selectedCompetitions)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Step 2: Team Details */}
            {currentStep === 2 && (
              <TeamForm
                teamName={formData.teamName}
                leaderName={formData.leaderName}
                leaderEmail={formData.leaderEmail}
                leaderPhone={formData.leaderPhone}
                institution={formData.institution}
                teamMembers={formData.teamMembers}
                onChange={handleTeamDataChange}
                getFieldError={getFieldError}
                removeFieldError={removeFieldError}
              />
            )}

            {/* Step 3: Robot Details */}
            {currentStep === 3 && (
              <RobotForm
                competitions={formData.selectedCompetitions}
                robotDetails={formData.robotDetails}
                onChange={handleRobotDetailChange}
                getFieldError={getFieldError}
                removeFieldError={removeFieldError}
              />
            )}

            {/* Step 4: Review & Payment */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <ReviewSummary
                  teamData={{
                    teamName: formData.teamName,
                    leaderName: formData.leaderName,
                    leaderEmail: formData.leaderEmail,
                    leaderPhone: formData.leaderPhone,
                    institution: formData.institution,
                    teamMembers: formData.teamMembers
                  }}
                  selectedCompetitions={formData.selectedCompetitions}
                  robotDetails={formData.robotDetails}
                  onEditStep={handleEditStep}
                />
                
                {/* Payment Options */}
                <PaymentOptions
                  totalAmount={calculateTotal(formData.selectedCompetitions)}
                  onPayNow={() => handleSubmit('now')}
                  onPayLater={() => handleSubmit('later')}
                  isLoading={submitting}
                />
              </div>
            )}
            </StepTransition>
          </div>

          {/* Navigation Buttons - Hidden on Step 4 (Payment has own buttons) */}
          {currentStep < 4 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 pt-6 border-t gap-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1 || submitting}
                className="
                  flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
                  bg-gray-100 text-gray-700 hover:bg-gray-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 min-h-[44px]
                "
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleNextStep}
                className="
                  flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
                  bg-blue-600 text-white hover:bg-blue-700
                  transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px]
                "
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Back button for payment step */}
          {currentStep === 4 && (
            <div className="mt-6">
              <button
                onClick={handlePrevStep}
                disabled={submitting}
                className="
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  bg-gray-100 text-gray-700 hover:bg-gray-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Review
              </button>
            </div>
          )}
        </div>

        {/* Competition Preview Modal */}
        {previewCompetition && (
          <CompetitionPreview
            competitionSlug={previewCompetition}
            isOpen={!!previewCompetition}
            onClose={() => setPreviewCompetition(null)}
          />
        )}

        {/* Success Celebration */}
        {showSuccess && (
          <SuccessCelebration
            onComplete={() => router.push('/dashboard?registered=success')}
          />
        )}

        {/* Razorpay Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </div>
    </div>
  )
}
