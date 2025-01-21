'use client'

import { motion } from 'framer-motion'
import LoginButton from './LoginButton'

interface AuthFormProps {
  mode: 'login' | 'signup'
  error?: string
}

export default function AuthForm({ mode, error }: AuthFormProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <LoginButton callbackUrl="/team-register" />
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
} 