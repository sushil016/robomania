'use client'

import { motion } from 'framer-motion'
import { Users, Target, Rocket, Award, Zap, Heart } from 'lucide-react'
import ScrollingImageGrid from '@/components/ScrollingImageGrid'

const stats = [
  { label: 'Active Members', value: '200+', icon: Users },
  { label: 'Projects Completed', value: '50+', icon: Rocket },
  { label: 'Awards Won', value: '25+', icon: Award },
  { label: 'Years Active', value: '5+', icon: Zap },
]

const values = [
  {
    icon: Target,
    title: 'Innovation',
    description: 'Pushing the boundaries of robotics and technology to create cutting-edge solutions.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Fostering teamwork and knowledge sharing among passionate robotics enthusiasts.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Heart,
    title: 'Excellence',
    description: 'Striving for the highest standards in every project and competition we undertake.',
    color: 'from-purple-500 to-pink-500'
  },
]

// Team images from aboutus-assets folder
const teamImages = [
  { src: '/aboutus-assets/WhatsApp Image 2025-12-04 at 23.47.23.jpeg', alt: 'Team Workshop' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-04 at 23.50.23.jpeg', alt: 'Competition Day' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-04 at 23.52.44.jpeg', alt: 'Robot Building' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-05 at 00.00.20.jpeg', alt: 'Team Meeting' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.54.30 (2).jpeg', alt: 'Award Ceremony' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.54.30.jpeg', alt: 'Lab Work' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.54.31 (1).jpeg', alt: 'Testing Phase' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.54.31.jpeg', alt: 'Team Photo' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.20 (2).jpeg', alt: 'Workshop Session' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.21.jpeg', alt: 'Robotics Event' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.22.jpeg', alt: 'Team Collaboration' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.23 (1).jpeg', alt: 'Innovation Lab' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.27.jpeg', alt: 'Tech Discussion' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.28 (1).jpeg', alt: 'Project Development' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.28 (2).jpeg', alt: 'Team Spirit' },
  { src: '/aboutus-assets/WhatsApp Image 2025-12-06 at 03.57.30 (2).jpeg', alt: 'Robonauts Team' },
]

export default function AboutPage() {
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
            <motion.h1
              className="text-4xl md:text-6xl font-bold font-orbitron mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 bg-clip-text text-transparent">
                About Robonauts
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 text-lg max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Innovation and Robotics Lab of BVCOE - Empowering the next generation of robotics engineers
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-10 h-10 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Robonauts, the Innovation and Robotics Lab of Bharati Vidyapeeth's College of Engineering, 
                is dedicated to fostering innovation and excellence in robotics and automation. We are a 
                passionate community of students, engineers, and technology enthusiasts working together to 
                push the boundaries of what's possible in robotics.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Through hands-on projects, competitions, and collaborative learning, we aim to develop 
                cutting-edge solutions while nurturing the next generation of robotics professionals. 
                Our lab serves as a hub for creativity, technical excellence, and innovation.
              </p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6 text-center">
                    <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${value.color} rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300`} />
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-8 h-full">
                    <value.icon className="w-12 h-12 text-orange-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What We Do Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-8">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Robotics Competitions</h4>
                      <p className="text-gray-400">Participating in national and international robotics competitions like RoboWars, RoboRace, and RoboSoccer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Research & Development</h4>
                      <p className="text-gray-400">Conducting innovative research in robotics, AI, and automation technologies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Workshops & Training</h4>
                      <p className="text-gray-400">Organizing workshops and training sessions to enhance technical skills</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Community Building</h4>
                      <p className="text-gray-400">Creating a vibrant community of robotics enthusiasts and innovators</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Project Development</h4>
                      <p className="text-gray-400">Building innovative robotics projects and prototypes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Industry Collaboration</h4>
                      <p className="text-gray-400">Partnering with industry leaders to bring real-world experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">Our Journey</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              A glimpse into our lab, competitions, workshops, and the amazing moments we've shared together
            </p>
            <div className="max-w-6xl mx-auto">
              <ScrollingImageGrid images={teamImages} />
            </div>
          </motion.div>

          {/* Join Us CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-12 max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Join Our Community
              </h3>
              <p className="text-gray-400 mb-8">
                Be part of something extraordinary. Whether you're a beginner or an expert, 
                there's a place for you in the Robonauts family.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://www.linkedin.com/company/robonauts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/50"
                >
                  Follow Us on LinkedIn
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-3xl border border-white/20 hover:border-white/40 text-white font-bold rounded-full transition-all duration-300"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
