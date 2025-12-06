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
    <div className="min-h-screen relative w-full overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[150px]" />
      </div>

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 w-full">
        <div className="max-w-6xl mx-auto w-full">
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
            className={'relative h-48 sm:h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-gradient-to-br ' + event.gradient + ' mb-6 sm:mb-8'}
          >
            {/* Background Image */}
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 backdrop-blur-[2px]" />
            
            {/* Registration Open Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 px-3 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/50">
              <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">🎯 Registration Open</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                <div className="flex-1 w-full">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-white mb-2 drop-shadow-lg">{event.name}</h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200 drop-shadow-md">{event.tagline}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <p className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 text-gray-100 bg-white/10 backdrop-blur-md rounded-full font-bold text-lg sm:text-2xl border border-white/20 whitespace-nowrap text-center">
                    ₹{event.price}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 p-4 sm:p-5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm sm:text-base">February 2025</span>
            </div>
            <span className="hidden sm:inline text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm sm:text-base">Kharghar, Navi Mumbai</span>
            </div>
            <span className="hidden sm:inline text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm sm:text-base">Team Size: 2-5 members</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                <span>About This Event</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">{event.fullDescription}</p>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                <span>Technical Specifications</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {event.specifications.map((spec, i) => (
                  <div key={i} className={'p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ' + event.gradient + ' bg-opacity-10 border ' + event.borderColor}>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">{spec.label}</p>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-white break-words">{spec.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rules & Regulations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                  <span>Rules & Regulations</span>
                </h2>
                <button
                  onClick={handleDownloadRulebook}
                  className={'flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r ' + event.gradient + ' rounded-lg text-white text-sm sm:text-base font-medium hover:opacity-90 transition-opacity shadow-lg whitespace-nowrap'}
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Download Rulebook</span>
                  <span className="sm:hidden">Rulebook</span>
                </button>
              </div>
              <div className="grid gap-2 sm:gap-3">
                {event.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className={'flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r ' + event.gradient + ' flex items-center justify-center text-xs sm:text-sm font-bold text-white'}>
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm sm:text-base">{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                <span>Event Schedule</span>
              </h2>
              <div className="relative">
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-orange-500 via-red-500 to-orange-500" />
                <div className="space-y-3 sm:space-y-4">
                  {event.schedule.map((item, i) => (
                    <div key={i} className="flex items-start sm:items-center gap-4 sm:gap-6 pl-8 relative">
                      <div className={'absolute left-0 w-6 h-6 rounded-full bg-gradient-to-r ' + event.gradient + ' border-4 border-gray-900 shadow-lg flex-shrink-0'} />
                      <span className="text-sm sm:text-base font-mono font-semibold text-orange-400 w-20 sm:w-28 flex-shrink-0">{item.time}</span>
                      <span className="text-gray-200 text-sm sm:text-base lg:text-lg">{item.activity}</span>
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
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                <span>Prizes & Awards</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {event.prizes.map((prize, i) => (
                  <div 
                    key={i} 
                    className={'p-4 sm:p-6 rounded-xl text-center border-2 ' + 
                      (i === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : 
                       i === 1 ? 'bg-gray-400/10 border-gray-400/50' : 
                       i === 2 ? 'bg-orange-700/10 border-orange-700/50' :
                       'bg-purple-500/10 border-purple-500/50')
                    }
                  >
                    <p className={'text-sm sm:text-base font-semibold mb-2 ' + 
                      (i === 0 ? 'text-yellow-400' : 
                       i === 1 ? 'text-gray-300' : 
                       i === 2 ? 'text-orange-400' :
                       'text-purple-400')
                    }>
                      {prize.position}
                    </p>
                    <p className="text-white font-bold text-lg sm:text-xl">{prize.prize}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Coordinators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                <span>Event Coordinators</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {event.coordinators.map((coordinator, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ' + event.gradient + ' flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0'}>
                        {coordinator.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-base sm:text-lg">{coordinator.name}</p>
                        <p className="text-gray-400 text-sm sm:text-base">{coordinator.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-auto sm:ml-0">
                      <a 
                        href={'tel:' + coordinator.phone} 
                        className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" 
                        title="Call"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </a>
                      <a 
                        href={'https://wa.me/91' + coordinator.phone} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 sm:p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors" 
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
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
              className="sticky bottom-4 sm:bottom-6 z-10"
            >
              <Link 
                href="/team-register" 
                className={'block w-full py-4 sm:py-5 text-center font-bold text-white text-lg sm:text-xl rounded-xl bg-gradient-to-r ' + event.gradient + ' hover:opacity-90 transition-opacity shadow-2xl'}
              >
                <span className="hidden sm:inline">Register for {event.name} - ₹{event.price}</span>
                <span className="sm:hidden">Register Now - ₹{event.price}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
