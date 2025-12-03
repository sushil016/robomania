'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
}

interface ModernStepIndicatorProps {
  currentStep: number
  steps: Step[]
}

export function ModernStepIndicator({ currentStep, steps }: ModernStepIndicatorProps) {
  return (
    <div className="w-full py-8">
      {/* Mobile: Compact Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center text-sm text-gray-700 mt-3 font-medium">
          {steps[currentStep - 1].title}
        </p>
      </div>

      {/* Desktop: Full Step Indicator */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10" />
          
          {/* Animated Progress Line */}
          <motion.div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 -z-10"
            initial={{ width: 0 }}
            animate={{ 
              width: currentStep === 1 
                ? '0%' 
                : `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = step.number < currentStep
              const isCurrent = step.number === currentStep
              const isPending = step.number > currentStep

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : isCurrent ? (
                      <div className="relative w-10 h-10">
                        {/* Pulsing ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-500"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                        {/* Main circle */}
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {step.number}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 font-medium text-lg">
                          {step.number}
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <motion.div
                    className="mt-3 text-center"
                    animate={{
                      y: isCurrent ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-blue-600'
                          : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-xs mt-1 transition-colors ${
                        isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Step Highlight Banner */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{currentStep}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
