'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

const sponsors = {
  title: {
    name: 'Red Bull',
    logo: '/redbull-logo.png',
    tier: 'Title Sponsor',
    description: 'Powering innovation and excellence in robotics',
    color: 'from-red-600 to-blue-600'
  },
  associate: [
    {
      name: 'PNT Robotics',
      logo: '/pnt-robotics-logo.jpg',
      tier: 'Bold Innovation Partner',
      description: 'Driving robotics innovation forward',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Hi Technology',
      logo: '/hi-technology-logo.jpg',
      tier: 'Electronic Component Partner',
      description: 'Supplying cutting-edge electronic components',
      color: 'from-cyan-500 to-blue-500'
    }
  ],
  beverages: {
    name: 'Campa Cola',
    logo: '/Campa_Cola_logo.png',
    tier: 'Beverages Partner',
    description: 'Keeping our team refreshed and energized',
    color: 'from-green-500 to-emerald-600'
  }
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px]" />
      </div>

      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">RoboMania 2025</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold font-orbitron mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 bg-clip-text text-transparent">
                Our Sponsors
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              We are grateful to our amazing sponsors who make RoboMania possible
            </motion.p>
          </motion.div>

          {/* Title Sponsor */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Title Sponsor
              </h2>
              <p className="text-gray-400">Official Title Partner</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group max-w-4xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500" />
              <div className="relative bg-red-900/40 backdrop-blur-3xl border border-red-500/30 rounded-3xl p-12 md:p-16">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md h-48 mb-6">
                    <Image
                      src={sponsors.title.logo}
                      alt={sponsors.title.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-300 text-lg text-center">
                    {sponsors.title.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Associate Sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Our Partners
              </h2>
              <p className="text-gray-400">Strategic Partners & Sponsors</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sponsors.associate.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${sponsor.color} rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500`} />
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center mb-6">
                      <div className="relative w-full h-32 mb-4">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold mb-2 bg-gradient-to-r ${sponsor.color} bg-clip-text text-transparent uppercase tracking-wide`}>
                        {sponsor.tier}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {sponsor.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Beverages Partner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Beverages Partner
              </h2>
              <p className="text-gray-400">Official Refreshment Partner</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group max-w-3xl mx-auto"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-10 md:p-12">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-xs h-40 mb-6">
                    <Image
                      src={sponsors.beverages.logo}
                      alt={sponsors.beverages.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-400 text-center">
                    {sponsors.beverages.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Become a Sponsor CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Interested in Sponsoring?
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Join us in making RoboMania 2025 the biggest robotics event of the year.
                  Partner with us to showcase your brand to thousands of robotics enthusiasts.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-8 py-4 bg-orange-500/50 backdrop-blur-xl hover:bg-orange-500/60 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-105 border border-orange-400/30"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
