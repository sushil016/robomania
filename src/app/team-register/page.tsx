'use client'

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
  
  // Ref to prevent duplicate form submissions (race condition protection)
  const isSubmittingRef = useRef(false)
  
  const [hasExistingTeam, setHasExistingTeam] = useState(false)
  const [existingTeamId, setExistingTeamId] = useState<string | null>(null)
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  const [alreadyRegisteredCompetitions, setAlreadyRegisteredCompetitions] = useState<string[]>([])
  const [isFullyRegistered, setIsFullyRegistered] = useState(false)
  
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
      // Always use session email for leader (cannot be changed)
      const sessionEmail = session.user.email || ''
      
      setFormData(prev => ({
        ...prev,
        leaderEmail: sessionEmail, // Always force session email
        leaderName: autoFillData?.leaderName || prev.leaderName,
        institution: autoFillData?.institution || prev.institution,
      }))

      // Check for existing team
      try {
        const response = await fetch('/api/check-registration')
        const data = await response.json()
        
        if (data.hasRegistered && data.teamId) {
          setHasExistingTeam(true)
          setExistingTeamId(data.teamId)
          
          // Track already registered competitions
          if (data.registeredCompetitions && data.registeredCompetitions.length > 0) {
            const registeredCompTypes = data.registeredCompetitions.map((comp: any) => {
              // Map competition types to lowercase IDs
              const typeMap: Record<string, string> = {
                'ROBOWARS': 'robowars',
                'ROBORACE': 'roborace',
                'ROBOSOCCER': 'robosoccer'
              }
              return typeMap[comp.competition_type] || comp.competition_type.toLowerCase()
            })
            
            // If user is registered for all 3 competitions, show message then redirect
            if (registeredCompTypes.length >= 3) {
              setIsFullyRegistered(true)
              setLoading(false)
              // Redirect after showing message
              setTimeout(() => {
                router.push('/dashboard')
              }, 2500)
              return
            }
            
            setAlreadyRegisteredCompetitions(registeredCompTypes)
          }
          
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

  // Navigation handlers (defined before keyboard shortcuts useEffect)
  const handleNextStep = useCallback(() => {
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
  }, [currentStep, formData, validateStep1, validateStep2, validateStep3, clearErrors, validationErrors])

  const handlePrevStep = useCallback(() => {
    setStepDirection('backward')
    const prevStep = Math.max(currentStep - 1, 1)
    setCurrentStep(prevStep)
    clearErrors()
    
    // Announce step change to screen readers
    const stepNames = ['', 'Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']
    announceToScreenReader(`Moved back to step ${prevStep}: ${stepNames[prevStep]}`)
    
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [currentStep, clearErrors])

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
  }, [currentStep, submitting, previewCompetition, showDraftPrompt, handleNextStep, handlePrevStep])

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
    // Prevent toggling already registered competitions
    if (alreadyRegisteredCompetitions.includes(competitionId)) {
      return
    }
    
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

  const handleEditStep = (step: number) => {
    setStepDirection(step < currentStep ? 'backward' : 'forward')
    setCurrentStep(step)
    
    // Announce step change to screen readers
    const stepNames = ['', 'Select Competitions', 'Team Details', 'Robot Details', 'Review & Payment']
    announceToScreenReader(`Editing step ${step}: ${stepNames[step]}`)
    
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const handleSubmit = async (paymentMethod: 'now' | 'later', gateway?: 'razorpay' | 'phonepe') => {
    // Prevent duplicate submissions using ref (handles race conditions)
    if (isSubmittingRef.current || submitting) {
      console.log('⚠️ Submission already in progress, ignoring duplicate request')
      return
    }
    
    isSubmittingRef.current = true
    setSubmitting(true)
    setError('')

    try {
      if (paymentMethod === 'later') {
        // Create order without payment for draft registration
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
            paymentMethod: 'later'
          })
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
          throw new Error(orderData.error || 'Failed to create registration')
        }

        clearStorage()
        router.push('/dashboard?registered=pending')
        return
      }

      // Handle payment based on selected gateway
      if (gateway === 'phonepe') {
        // PhonePe payment flow
        const orderResponse = await fetch('/api/phonepe/create-order', {
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
            robotDetails: formData.robotDetails
          })
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
          throw new Error(orderData.error || 'Failed to create PhonePe order')
        }

        // Initiate PhonePe payment
        const paymentResponse = await fetch('/api/phonepe/initiate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantOrderId: orderData.merchantOrderId,
            amount: orderData.totalAmount,
            userEmail: formData.leaderEmail,
            teamName: formData.teamName
          })
        })

        const paymentData = await paymentResponse.json()

        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || 'Failed to initiate PhonePe payment')
        }

        console.log('📱 PhonePe payment data:', paymentData)

        // Redirect to PhonePe payment page
        // For mobile UPI redirect to work properly, we need to open in the current window
        // and ensure user interaction triggers it (no popups blocked)
        if (paymentData.redirectUrl) {
          // Direct navigation - this ensures UPI apps can be triggered on mobile
          window.location.href = paymentData.redirectUrl
        } else {
          throw new Error('No redirect URL received from PhonePe')
        }
        
        // Return early as we're redirecting
        return
      } else {
        // Razorpay payment flow (existing logic)
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
            paymentMethod: 'now'
          })
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
          throw new Error(orderData.error || 'Failed to create registration')
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
              isSubmittingRef.current = false
              setError('Payment cancelled. Your registration has been saved as draft.')
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  if (loading) {
    return <LoadingState message="Loading registration form..." />
  }

  // Show message when user is registered for all competitions
  if (isFullyRegistered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Diagonal Orange Beam Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-amber-50/30 to-transparent rotate-12 blur-3xl"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-50/20 to-transparent -rotate-12 blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-orange-200/50 p-8 text-center relative z-10 border border-orange-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;re All Set! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully registered for all three competitions. Head to your dashboard to manage your registrations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['RoboWars', 'RoboRace', 'RoboSoccer'].map((comp) => (
              <span
                key={comp}
                className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium rounded-full border border-green-200"
              >
                ✓ {comp}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 relative overflow-hidden">
      {/* Diagonal Orange Beam Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-amber-50/30 to-transparent rotate-12 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-50/20 to-transparent -rotate-12 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[100px] bg-gradient-to-r from-orange-200/20 to-amber-200/20 rotate-45 blur-2xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-200/50">
              ROBOMANIA 2025
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Team Registration
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Complete your registration for the ultimate robotics competition
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 mt-2"
          >
            Tip: Use arrow keys (← →) to navigate between steps
          </motion.p>
          {autoSaving && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600"
            >
              <Save className="w-4 h-4" />
              <span>Draft saved automatically</span>
            </motion.div>
          )}
        </div>

        {/* Draft Prompt */}
        {showDraftPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Resume Previous Registration?</h3>
                <p className="text-sm text-orange-700">We found a saved draft of your registration.</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadDraft}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 text-sm font-semibold shadow-lg shadow-orange-200/50"
                >
                  Load Draft
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={discardDraft}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium"
                >
                  Start Fresh
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100"
        >
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
                    {COMPETITIONS.map((competition) => {
                      const isAlreadyRegistered = alreadyRegisteredCompetitions.includes(competition.id)
                      return (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          isSelected={formData.selectedCompetitions.includes(competition.id)}
                          onToggle={() => handleCompetitionToggle(competition.id)}
                          onPreview={() => setPreviewCompetition(competition.slug)}
                          disabled={isAlreadyRegistered}
                          disabledReason="Already Registered"
                        />
                      )
                    })}
                  </div>
                  {getFieldError('competitions') && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError('competitions')}</span>
                    </div>
                  )}
                  {formData.selectedCompetitions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          ₹{calculateTotal(formData.selectedCompetitions)}
                        </span>
                      </div>
                    </motion.div>
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
                  onPayNow={(gateway) => handleSubmit('now', gateway)}
                  onPayLater={() => handleSubmit('later')}
                  isLoading={submitting}
                />
              </div>
            )}
            </StepTransition>
          </div>

          {/* Navigation Buttons - Hidden on Step 4 (Payment has own buttons) */}
          {currentStep < 4 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrevStep}
                disabled={currentStep === 1 || submitting}
                className="
                  flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium
                  bg-gray-100 text-gray-700 hover:bg-gray-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 min-h-[44px]
                "
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextStep}
                className="
                  flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-orange-500 to-amber-500 text-white
                  hover:from-orange-600 hover:to-amber-600
                  transition-all duration-200 shadow-lg min-h-[44px]
                "
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Back button for payment step */}
          {currentStep === 4 && (
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrevStep}
                disabled={submitting}
                className="
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                  bg-gray-100 text-gray-700 hover:bg-gray-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Review
              </motion.button>
            </div>
          )}
        </motion.div>

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
