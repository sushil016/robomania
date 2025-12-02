'use client'

import { motion } from 'framer-motion'
import { Tab } from '@headlessui/react'
import { Trophy, Clock, Star } from 'lucide-react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const scheduleData = [
  { time: '09:00 AM', event: 'Opening Ceremony' },
  { time: '10:00 AM', event: 'Preliminary Rounds Begin' },
  { time: '01:00 PM', event: 'Lunch Break' },
  { time: '02:00 PM', event: 'Quarter Finals' },
  { time: '04:00 PM', event: 'Semi Finals' },
  { time: '06:00 PM', event: 'Final Battle' },
  { time: '07:00 PM', event: 'Award Ceremony' },
]

const leaderboardData = [
  { rank: 1, team: 'Mech Marvels', points: 150 },
  { rank: 2, team: 'Circuit Breakers', points: 135 },
  { rank: 3, team: 'Team Alpha', points: 120 },
  { rank: 4, team: 'RoboWarriors', points: 105 },
  { rank: 5, team: 'Binary Bots', points: 90 },
]

export default function LiveUpdates() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-orbitron mb-4">
            <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              Live Updates
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest event schedules and rankings
          </p>
        </motion.div>

        <Tab.Group>
          <Tab.List className="flex space-x-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl mb-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-black ring-[#00CED1]',
                  selected
                    ? 'bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-gray-900 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/10'
                )
              }
            >
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-black ring-[#00CED1]',
                  selected
                    ? 'bg-gradient-to-r from-[#FF4500] to-[#00CED1] text-gray-900 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/10'
                )
              }
            >
              <div className="flex items-center justify-center">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="space-y-4">
                  {scheduleData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-900 to-black"
                    >
                      <span className="text-[#00CED1] font-mono">{item.time}</span>
                      <span className="text-gray-900">{item.event}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="space-y-4">
                  {leaderboardData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-900 to-black"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                          {index === 1 && <Star className="w-6 h-6 text-gray-400" />}
                          {index === 2 && <Star className="w-6 h-6 text-amber-600" />}
                          {index > 2 && <span className="text-gray-600">#{item.rank}</span>}
                        </div>
                        <span className="ml-4 text-gray-900 font-medium">{item.team}</span>
                      </div>
                      <span className="text-[#00CED1] font-mono">{item.points} pts</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
}

