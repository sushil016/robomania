'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Download, Users, Bot, Swords, Shield } from 'lucide-react'

const rules = [
  { 
    id: 1, 
    title: 'Team Composition', 
    description: 'Each team must consist of 3-5 members from the same institution.',
    icon: Users
  },
  { 
    id: 2, 
    title: 'Robot Specifications', 
    description: 'Robots must not exceed 50cm in any dimension and must weigh less than 5kg.',
    icon: Bot
  },
  { 
    id: 3, 
    title: 'Battle Rules', 
    description: 'Matches will be 3 minutes long. The robot that immobilizes the opponent or pushes it out of the arena wins.',
    icon: Swords
  },
  { 
    id: 4, 
    title: 'Safety Regulations', 
    description: 'All robots must have a clearly visible power switch and must not use hazardous materials.',
    icon: Shield
  },
]

export default function EventDetails() {
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
              Event Details
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join us for an epic battle of robots where engineering meets combat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 to-black p-[1px] rounded-xl"
            >
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl h-full">
                <rule.icon className="w-8 h-8 text-[#00CED1] mb-4" />
                <h3 className="text-xl font-bold font-orbitron text-white mb-2">
                  {rule.title}
                </h3>
                <p className="text-white/60">
                  {rule.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link 
            href="/rulebook.pdf"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FF4500] to-[#00CED1] rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Download className="mr-2" />
            Download Full Rulebook
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

