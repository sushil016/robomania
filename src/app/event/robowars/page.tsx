'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, 
  MessageCircle, 
  Users, 
  Download, 
  Clock, 
  MapPin, 
  Calendar,
  Shield,
  Cpu,
  Award,
  ArrowLeft,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getEventBySlug } from '@/lib/eventsData'

export default function RoboWarsPage() {
  const event = getEventBySlug('ROBOWARS')

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Event not found</p>
      </div>
    )
  }

  const IconComponent = event.icon

  const handleDownloadRulebook = () => {
    window.open(event.rulebookUrl, '_blank')
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[150px]" />
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link 
              href="/event-details"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={'relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br ' + event.gradient + ' mb-8'}
          >
            {/* Background Image */}
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Registration Open Badge */}
            <div className="absolute top-6 left-6 px-2 py-1 bg-green-500/10 backdrop-blur-sm rounded-full border border-green-400/50">
              <span className="text-white font-bold text-sm drop-shadow-lg">🎯 Registration Open</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
              <div className="flex items-center gap-6">
                {/* <div className={'w-20 h-20 rounded-xl bg-gradient-to-br ' + event.gradient + ' flex items-center justify-center shadow-2xl'}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div> */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold font-orbitron text-white mb-2">{event.name}</h1>
                  <p className="text-xl text-gray-200">{event.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm px-6 py-3 text-gray-300 mb-1 bg-white/10 backdrop-blur-sm rounded-full font-bold text-2xl border border-white/20">Registration Fee : ₹{event.price}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300">February 2025</span>
            </div>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">Kharghar, Navi Mumbai</span>
            </div>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300">Team Size: 2-5 members</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Cpu className="w-6 h-6 text-orange-400" />
                About This Event
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{event.fullDescription}</p>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-400" />
                Technical Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.specifications.map((spec, i) => (
                  <div key={i} className={'p-4 rounded-xl bg-gradient-to-br ' + event.gradient + ' bg-opacity-10 border ' + event.borderColor}>
                    <p className="text-sm text-gray-400 mb-1">{spec.label}</p>
                    <p className="text-xl font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rules & Regulations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-400" />
                  Rules & Regulations
                </h2>
                <button
                  onClick={handleDownloadRulebook}
                  className={'flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ' + event.gradient + ' rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-lg'}
                >
                  <Download className="w-4 h-4" />
                  Download Rulebook
                </button>
              </div>
              <div className="grid gap-3">
                {event.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className={'flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r ' + event.gradient + ' flex items-center justify-center text-sm font-bold text-white'}>
                      {i + 1}
                    </span>
                    <span className="text-gray-300">{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-400" />
                Event Schedule
              </h2>
              <div className="relative">
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-orange-500 via-red-500 to-orange-500" />
                <div className="space-y-4">
                  {event.schedule.map((item, i) => (
                    <div key={i} className="flex items-center gap-6 pl-8 relative">
                      <div className={'absolute left-0 w-6 h-6 rounded-full bg-gradient-to-r ' + event.gradient + ' border-4 border-gray-900 shadow-lg'} />
                      <span className="text-base font-mono font-semibold text-orange-400 w-28">{item.time}</span>
                      <span className="text-gray-200 text-lg">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Prizes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-orange-400" />
                Prizes & Awards
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {event.prizes.map((prize, i) => (
                  <div 
                    key={i} 
                    className={'p-6 rounded-xl text-center border-2 ' + 
                      (i === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : 
                       i === 1 ? 'bg-gray-400/10 border-gray-400/50' : 
                       i === 2 ? 'bg-orange-700/10 border-orange-700/50' :
                       'bg-purple-500/10 border-purple-500/50')
                    }
                  >
                    <p className={'text-base font-semibold mb-2 ' + 
                      (i === 0 ? 'text-yellow-400' : 
                       i === 1 ? 'text-gray-300' : 
                       i === 2 ? 'text-orange-400' :
                       'text-purple-400')
                    }>
                      {prize.position}
                    </p>
                    <p className="text-white font-bold text-xl">{prize.prize}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Coordinators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-orange-400" />
                Event Coordinators
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {event.coordinators.map((coordinator, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={'w-14 h-14 rounded-full bg-gradient-to-br ' + event.gradient + ' flex items-center justify-center text-white font-bold text-xl shadow-lg'}>
                        {coordinator.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">{coordinator.name}</p>
                        <p className="text-gray-400">{coordinator.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={'tel:' + coordinator.phone} 
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" 
                        title="Call"
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </a>
                      <a 
                        href={'https://wa.me/91' + coordinator.phone} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors" 
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 text-green-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="sticky bottom-6 z-10"
            >
              <Link 
                href="/team-register" 
                className={'block w-full py-5 text-center font-bold text-white text-xl rounded-xl bg-gradient-to-r ' + event.gradient + ' hover:opacity-90 transition-opacity shadow-2xl'}
              >
                Register for {event.name} - ₹{event.price}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
