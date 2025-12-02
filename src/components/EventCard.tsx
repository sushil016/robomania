'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export interface Coordinator {
  name: string
  phone: string
}

export interface EventData {
  id: string
  name: string
  tagline: string
  description: string
  fullDescription: string
  price: number
  icon: React.ElementType
  color: string
  gradient: string
  borderColor: string
  coordinators: Coordinator[]
  rules: string[]
  specifications: { label: string; value: string }[]
  schedule: { time: string; activity: string }[]
  prizes: { position: string; prize: string }[]
  rulebookUrl: string
  image: string
}

interface EventCardProps {
  event: EventData
  index: number
  href: string
}

export default function EventCard({ event, index, href }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = event.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href}>
        <motion.div 
          className="absolute -inset-[2px] rounded-2xl overflow-hidden"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, ' + (event.color === 'orange' ? '#f97316' : event.color === 'cyan' ? '#06b6d4' : '#22c55e') + ' 25%, transparent 50%, ' + (event.color === 'orange' ? '#ef4444' : event.color === 'cyan' ? '#3b82f6' : '#10b981') + ' 75%, transparent 100%)'
            }}
          />
        </motion.div>

        <motion.div
          className={'absolute -inset-4 bg-gradient-to-r ' + event.gradient + ' rounded-3xl blur-2xl'}
          animate={{ opacity: isHovered ? 0.25 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className={'relative bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border ' + event.borderColor + ' transition-all duration-300'}>
          <div className="relative h-44 overflow-hidden">
            {/* Background Image */}
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Gradient Overlay for better text visibility */}
            <div className={'absolute inset-0 bg-gradient-to-br ' + event.gradient + ' opacity-30'} />
            
            {/* Animated grid pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
              animate={{ backgroundPosition: isHovered ? ['0px 0px', '20px 20px'] : '0px 0px' }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* Registration Open Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-500/10 backdrop-blur-sm rounded-full border border-green-400/50">
              <span className="text-green-400 font-bold text-xs drop-shadow-lg"> Registration Open</span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white font-bold text-sm drop-shadow-lg">₹{event.price}</span>
            </div>

            {/* Click indicator */}
            <motion.div
              className="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm drop-shadow-lg"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              <span className="font-medium">View Details</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-bold font-orbitron text-white mb-1">{event.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{event.tagline}</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{event.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {event.specifications.slice(0, 2).map((spec, i) => (
                <div key={i} className="px-3 py-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-medium text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">
                Coordinators: {event.coordinators.map(c => c.name).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
