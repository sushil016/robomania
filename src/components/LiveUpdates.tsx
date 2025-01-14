'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'

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

const scoresData = [
  { team: 'Team Alpha', score: 85 },
  { team: 'RoboWarriors', score: 78 },
  { team: 'Mech Marvels', score: 92 },
  { team: 'Circuit Breakers', score: 88 },
  { team: 'Binary Bots', score: 76 },
]

const leaderboardData = [
  { rank: 1, team: 'Mech Marvels', points: 150 },
  { rank: 2, team: 'Circuit Breakers', points: 135 },
  { rank: 3, team: 'Team Alpha', points: 120 },
  { rank: 4, team: 'RoboWarriors', points: 105 },
  { rank: 5, team: 'Binary Bots', points: 90 },
]

export default function LiveUpdates() {
  const [categories] = useState({
    Schedule: scheduleData,
    Scores: scoresData,
    Leaderboard: leaderboardData,
  })

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-orbitron text-neon-green mb-8 text-center">Live Updates</h2>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-neon-green focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-neon-green text-black shadow'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="rounded-xl bg-gray-800 p-3">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.time}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-gray-800 p-3">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoresData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.team}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-gray-800 p-3">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.rank}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.team}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
}

