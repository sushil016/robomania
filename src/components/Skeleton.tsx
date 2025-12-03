'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rectangle'
  lines?: number
  width?: string
  height?: string
  animate?: boolean
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangle', 
  lines = 1,
  width = 'w-full',
  height = 'h-4',
  animate = true
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse'
  
  const variantClasses = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            transition={animate ? { delay: index * 0.1 } : undefined}
            className={`${baseClasses} ${variantClasses[variant]} ${height} ${
              index === lines - 1 ? 'w-3/4' : width
            } ${className}`}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity: 1 } : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`}
    />
  )
}

// Pre-built skeleton components for common patterns
export function SkeletonCard() {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="w-32" height="h-6" />
          <Skeleton width="w-48" height="h-4" />
        </div>
        <Skeleton variant="circle" width="w-6" height="h-6" />
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center gap-4">
        <Skeleton width="w-20" height="h-8" />
        <Skeleton width="w-20" height="h-8" />
      </div>
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton width="w-32" height="h-5" />
          <Skeleton width="w-full" height="h-12" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      <Skeleton width="w-full" height="h-10" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} width="w-full" height="h-16" />
      ))}
    </div>
  )
}
