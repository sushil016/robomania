'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const sponsors = [
  {
    id: 1,
    name: 'Red Bull',
    logo: '/redbull-logo.png',
    tier: 'Title Sponsor',
    bgColor: 'from-red-900/40 to-red-800/40'
  },
  {
    id: 2,
    name: 'PNT Robotics',
    logo: '/pnt-robotics-logo.jpg',
    tier: 'Associate Partner',
    bgColor: 'from-blue-900/40 to-blue-800/40'
  },
  {
    id: 3,
    name: 'Hi Technology',
    logo: '/hi-technology-logo.jpg',
    tier: 'Associate Partner',
    bgColor: 'from-purple-900/40 to-purple-800/40'
  },
  {
    id: 4,
    name: 'Campa Cola',
    logo: '/Campa_Cola_logo.png',
    tier: 'Beverages Partner',
    bgColor: 'from-orange-900/40 to-orange-800/40'
  },
]

export default function SponsorsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-white">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">
            <span className="bg-gradient-to-r from-[#FF4500] to-[#00CED1] bg-clip-text text-transparent">
              Our Sponsors
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powered by industry leaders who share our passion for innovation
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative group rounded-xl bg-gradient-to-br ${sponsor.bgColor} backdrop-blur-sm border border-white/20 p-6 overflow-hidden transition-all duration-300 hover:shadow-xl`}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                {/* Logo */}
                <div className="w-20 h-20 md:w-24 md:h-24 relative">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                
                {/* Tier badge */}
                <span className="text-xs md:text-sm font-semibold text-white/80 text-center px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                  {sponsor.tier}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 group"
          >
            <span>View All Sponsors</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
