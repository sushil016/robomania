'use client'

import { motion } from 'framer-motion'
import { Bot, Trophy, AlertCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BotDetails {
  id: string | null
  bot_name: string
  weight: number
  dimensions: string
  weapon_type?: string | null
  is_weapon_bot: boolean
  team_id?: string
  created_at?: string | null
}

interface CompetitionUsage {
  competition_type: string
  competition_name: string
  payment_status: string
  registration_status: string
}

interface BotWithUsage extends BotDetails {
  competitions: CompetitionUsage[]
}

interface BotManagementProps {
  bots: BotWithUsage[]
  isLoading?: boolean
  onRefresh?: () => void
}

const COMPETITION_NAMES: Record<string, string> = {
  ROBOWARS: 'RoboWars',
  ROBORACE: 'RoboRace',
  ROBOSOCCER: 'RoboSoccer'
}

const COMPETITION_RULES: Record<string, { icon: string; rule: string; color: string }> = {
  ROBOWARS: {
    icon: '⚔️',
    rule: 'One bot per entry - Each entry requires a unique bot',
    color: 'text-red-600'
  },
  ROBORACE: {
    icon: '🏁',
    rule: 'Same bot, multiple entries - Can use same bot for multiple entries',
    color: 'text-blue-600'
  },
  ROBOSOCCER: {
    icon: '⚽',
    rule: 'Same bot, multiple entries - Can use same bot for multiple entries',
    color: 'text-green-600'
  }
}

export function BotManagement({ bots, isLoading = false, onRefresh }: BotManagementProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider">Your Bots</h2>
        </div>
        <div className="border-2 border-black p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">Loading bots...</p>
        </div>
      </div>
    )
  }

  if (!bots || bots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider">Your Bots</h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-dashed border-gray-400 p-8 text-center"
        >
          <Bot className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-4">No bots registered yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/team-register')}
            className="border-2 border-black px-4 py-2 text-xs font-bold hover:bg-black hover:text-white transition-colors"
          >
            Register for Competition
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className="text-lg font-bold uppercase tracking-wider">Your Bots</h2>
          <span className="px-2 py-1 bg-black text-white text-xs font-bold">
            {bots.length}
          </span>
        </div>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="text-xs border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
          >
            Refresh
          </motion.button>
        )}
      </div>

      {/* Competition Rules Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border-2 border-blue-200 p-4"
      >
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm mb-2">Bot Usage Rules by Competition</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(COMPETITION_RULES).map(([key, rule]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-lg">{rule.icon}</span>
                  <div>
                    <span className="font-bold">{COMPETITION_NAMES[key]}:</span>
                    <span className={`ml-1 ${rule.color}`}>{rule.rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bot Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id || bot.bot_name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-2 border-black p-4 hover:shadow-lg transition-shadow"
          >
            {/* Bot Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">{bot.bot_name}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span>⚖️ {bot.weight}kg</span>
                  <span>📏 {bot.dimensions}</span>
                </div>
              </div>
              {bot.is_weapon_bot && bot.weapon_type && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold border border-red-300">
                  🔧 {bot.weapon_type}
                </span>
              )}
            </div>

            {/* Competition Usage */}
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Used in Competitions
                </span>
              </div>

              {bot.competitions && bot.competitions.length > 0 ? (
                <div className="space-y-2">
                  {bot.competitions.map((comp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 border border-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {COMPETITION_RULES[comp.competition_type]?.icon || '🏆'}
                        </span>
                        <span className="text-xs font-semibold">
                          {comp.competition_name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold ${
                          comp.payment_status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        {comp.payment_status === 'COMPLETED' ? '✓ Confirmed' : '⏳ Pending'}
                      </span>
                    </div>
                  ))}

                  {/* Bot Usage Warning for RoboWars */}
                  {bot.competitions.some(c => c.competition_type === 'ROBOWARS') &&
                    bot.competitions.filter(c => c.competition_type === 'ROBOWARS').length > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-300 p-2 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-700">
                          <strong>Rule Violation:</strong> RoboWars allows only one bot per entry.
                          This bot is used in {bot.competitions.filter(c => c.competition_type === 'ROBOWARS').length} RoboWars entries.
                        </p>
                      </motion.div>
                    )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic bg-gray-50 p-3 border border-dashed border-gray-300 text-center">
                  Not used in any competition yet
                </div>
              )}
            </div>

            {/* Bot Actions */}
            <div className="mt-3 pt-3 border-t border-gray-300">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-xs py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add New Bot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border-2 border-dashed border-gray-400 p-6 text-center hover:border-black transition-colors cursor-pointer"
        onClick={() => router.push('/team-register')}
        whileHover={{ scale: 1.01 }}
      >
        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-bold text-gray-700">Register New Bot</p>
        <p className="text-xs text-gray-500 mt-1">Create a new competition entry</p>
      </motion.div>
    </div>
  )
}
