import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300 
                    ${
                      isCompleted
                        ? 'bg-blue-600 text-white scale-110'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-110'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs md:text-sm font-medium text-center max-w-[80px] md:max-w-none
                    transition-colors duration-300
                    ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                  `}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Description */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {stepLabels[currentStep - 1]}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
