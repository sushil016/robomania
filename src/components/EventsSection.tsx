'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { eventsData } from '@/lib/eventsData'

const eventSlugMap: { [key: string]: string } = {
  'ROBOWARS': 'robowars',
  'ROBORACE': 'roborace',
  'ROBOSOCCER': 'robosoccer'
}

export default function EventDetailsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[200px]" />
      </div>

      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">February 2025</span>
              <span className="text-gray-600">•</span>
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Kharghar, Navi Mumbai, India</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-bold font-orbitron mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 bg-clip-text text-transparent">
                Our Events
              </span>
            </motion.h1>

            <motion.p className="text-gray-400 text-lg max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Click on any event to view detailed rules, specifications, schedule, and prizes.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index} 
                href={`/event/${eventSlugMap[event.id]}`}
              />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-cyan-500 p-1 rounded-xl">
              <Link href="/team-register" className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                Register Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
