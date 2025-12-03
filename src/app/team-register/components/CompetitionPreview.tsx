'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Calendar, Users, Weight, Ruler, Target, Download, Phone, Mail } from 'lucide-react'
import { getEventBySlug } from '@/lib/eventsData'

interface CompetitionPreviewProps {
  competitionSlug: string
  isOpen: boolean
  onClose: () => void
}

export function CompetitionPreview({ competitionSlug, isOpen, onClose }: CompetitionPreviewProps) {
  const event = getEventBySlug(competitionSlug)

  if (!event) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                       md:w-full md:max-w-3xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{event.name}</h2>
                  <p className="text-blue-100">{event.tagline || event.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Trophy className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="text-xs text-gray-600">Prize Pool</div>
                  <div className="text-lg font-bold text-gray-900">
                    {event.prizes?.[0]?.prize || 'TBA'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 mb-2" />
                  <div className="text-xs text-gray-600">Team Size</div>
                  <div className="text-lg font-bold text-gray-900">
                    {event.specifications?.find(s => s.label === 'Team Size')?.value || 'TBA'}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Weight className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-xs text-gray-600">Max Weight</div>
                  <div className="text-lg font-bold text-gray-900">
                    {event.specifications?.find(s => s.label === 'Weight Limit')?.value || 'TBA'}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <Ruler className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-xs text-gray-600">Dimensions</div>
                  <div className="text-lg font-bold text-gray-900">
                    {event.specifications?.find(s => s.label === 'Dimensions')?.value || 'TBA'}
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Competition Rules
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {event.rules.slice(0, 5).map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                    {event.rules.length > 5 && (
                      <li className="text-sm text-gray-500 italic ml-4">
                        +{event.rules.length - 5} more rules (view full details)
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Prize Distribution */}
              {event.prizes && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    Prize Distribution
                  </h3>
                  <div className="space-y-2">
                    {event.prizes.map((prizeItem, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-900 capitalize">{prizeItem.position}</span>
                        <span className="text-lg font-bold text-amber-600">{prizeItem.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Event Schedule
                  </h3>
                  <div className="space-y-2">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-semibold text-blue-600 min-w-[80px]">{item.time}</div>
                        <div className="text-sm text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinators */}
              {event.coordinators && event.coordinators.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Event Coordinators</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {event.coordinators.map((coordinator, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-semibold text-gray-900 mb-2">{coordinator.name}</div>
                        <div className="space-y-1">
                          <a
                            href={`tel:${coordinator.phone}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                          >
                            <Phone className="w-4 h-4" />
                            {coordinator.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Rules Button */}
              <a
                href={event.rulebookUrl || '#'}
                download
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Download Complete Rulebook
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
