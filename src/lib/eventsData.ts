import { Zap, Target, Trophy } from 'lucide-react'
import { EventData } from '@/components/EventCard'

export const eventsData: EventData[] = [
  {
    id: 'ROBOWARS',
    name: 'RoboWar Championship',
    tagline: 'Battle of the Machines',
    description: 'Experience the ultimate robot combat! Build your warrior bot and fight for glory in the arena.',
    fullDescription: 'RoboWars is the flagship event of RoboMania 2025, where engineering meets destruction. Teams design and build combat robots to battle in an arena, using strategy, power, and innovation to defeat opponents. This is where legends are made and machines are tested to their limits.',
    price: 300,
    icon: Zap,
    color: 'orange',
    gradient: 'from-orange-500/90 via-red-500 to-orange-600',
    borderColor: 'border-orange-500/50',
    coordinators: [
      { name: 'Sushil Sahani', phone: '9967612372' },
      { name: 'Hitesh Rane', phone: '8624846106' }
    ],
    rules: [
      'Maximum robot weight: 8kg (excluding remote)',
      'Maximum dimensions: 50cm x 50cm x 50cm',
      'No projectile or liquid-based weapons allowed',
      'Remote controlled operation only (2.4GHz recommended)',
      'Battery voltage limit: 24V DC maximum',
      'No entanglement devices (nets, strings, etc.)',
      'Pneumatic systems pressure limit: 100 PSI',
      'All robots must have a visible power switch',
      'Flame-based weapons require prior approval',
      'Teams must bring their own batteries and chargers'
    ],
    specifications: [
      { label: 'Weight Limit', value: '8 kg' },
      { label: 'Dimensions', value: '50x50x50 cm' },
      { label: 'Voltage', value: '24V DC Max' },
      { label: 'Team Size', value: '2-5 members' }
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Check-in' },
      { time: '10:00 AM', activity: 'Technical Inspection' },
      { time: '11:00 AM', activity: 'Preliminary Rounds' },
      { time: '02:00 PM', activity: 'Quarter Finals' },
      { time: '03:30 PM', activity: 'Semi Finals' },
      { time: '04:30 PM', activity: 'Finals & Prize Distribution' }
    ],
    prizes: [
      { position: '1st Place', prize: '₹20,000 + Trophy' },
      { position: '2nd Place', prize: '₹12,000 + Medal' },
      { position: '3rd Place', prize: '₹7,000 + Medal' },
      { position: 'Best Design Award', prize: '₹4,000 + Certificate' }
    ],
    rulebookUrl: '/rulebooks/robowars-rulebook.pdf',
    image: '/robowar.png'
  },
  {
    id: 'ROBORACE',
    name: 'RoboRace',
    tagline: 'Speed. Precision. Victory.',
    description: 'Race against time and opponents! Navigate through challenging tracks with precision and speed.',
    fullDescription: 'RoboRace challenges teams to build the fastest and most agile robots capable of navigating complex tracks. Whether you choose line-following automation or manual control, your robot must complete the course in the shortest time possible.',
    price: 200,
    icon: Target,
    color: 'cyan',
    gradient: 'from-cyan-500 via-blue-500 to-cyan-600',
    borderColor: 'border-cyan-500/50',
    coordinators: [
      { name: 'Vihav', phone: '7060210994' },
      { name: 'Saurabh Thakur', phone: '7738917909' }
    ],
    rules: [
      'Robot can be line-following (autonomous) or manual control',
      'Maximum dimensions: 30cm x 30cm x 30cm',
      'Maximum weight: 5kg',
      'Time-based elimination in all rounds',
      'Track specifications revealed on event day',
      'Multiple attempts allowed in preliminary rounds',
      'No track modifications or markers allowed',
      'Robot must complete track without external assistance',
      'Wireless control frequency: 2.4GHz only',
      'Teams get 2 minutes preparation time before each run'
    ],
    specifications: [
      { label: 'Weight Limit', value: '5 kg' },
      { label: 'Dimensions', value: '30x30x30 cm' },
      { label: 'Control', value: 'Manual/Auto' },
      { label: 'Team Size', value: '2-4 members' }
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Check-in' },
      { time: '09:30 AM', activity: 'Track Reveal & Practice' },
      { time: '10:30 AM', activity: 'Time Trials Round 1' },
      { time: '12:00 PM', activity: 'Time Trials Round 2' },
      { time: '02:00 PM', activity: 'Knockout Rounds' },
      { time: '04:00 PM', activity: 'Finals & Prize Distribution' }
    ],
    prizes: [
      { position: '1st Place', prize: '₹10,000 + Trophy' },
      { position: '2nd Place', prize: '₹7,000 + Medal' },
      { position: '3rd Place', prize: '₹3,000 + Medal' }
    ],
    rulebookUrl: '/rulebooks/roborace-rulebook.pdf',
    image: '/roborace.png'
  },
  {
    id: 'ROBOSOCCER',
    name: 'RoboSoccer',
    tagline: 'The Beautiful Game, Reimagined',
    description: 'Football meets robotics! Control your bot to score goals and defend your territory.',
    fullDescription: 'RoboSoccer brings the world favorite sport into the realm of robotics. Teams build and control robots to play soccer in specially designed arenas. Strategy, teamwork, and precise control determine the champions.',
    price: 200,
    icon: Trophy,
    color: 'green',
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    borderColor: 'border-green-500/50',
    coordinators: [
      { name: 'Kunal', phone: '8928992045' },
      { name: 'Krushnal Patil', phone: '8857814743' }
    ],
    rules: [
      '2v2 team format (2 robots per team on field)',
      'Maximum robot dimensions: 20cm x 20cm x 20cm',
      'Maximum weight per robot: 3kg',
      'Match duration: 5 minutes per half (10 mins total)',
      'No grabbing or holding mechanisms allowed',
      'Ball cannot be lifted more than 5cm off ground',
      'Goalkeeper robot can be larger (25cm x 25cm)',
      'Goals scored by pushing ball fully past goal line',
      'Yellow card: 1 min penalty, Red card: disqualification',
      'Teams must provide backup robot or risk forfeit'
    ],
    specifications: [
      { label: 'Weight Limit', value: '3 kg/bot' },
      { label: 'Dimensions', value: '20x20x20 cm' },
      { label: 'Format', value: '2v2 Teams' },
      { label: 'Team Size', value: '2-4 members' }
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Check-in' },
      { time: '09:30 AM', activity: 'Technical Inspection' },
      { time: '10:00 AM', activity: 'Group Stage Matches' },
      { time: '01:00 PM', activity: 'Quarter Finals' },
      { time: '02:30 PM', activity: 'Semi Finals' },
      { time: '03:30 PM', activity: 'Finals & Prize Distribution' }
    ],
    prizes: [
      { position: '1st Place', prize: '₹10,000 + Trophy' },
      { position: '2nd Place', prize: '₹7,000 + Medal' },
      { position: '3rd Place', prize: '₹3,000 + Medal' }
    ],
    rulebookUrl: '/rulebooks/robosoccer-rulebook.pdf',
    image: '/robosoccer.png'
  }
]

export function getEventBySlug(slug: string): EventData | undefined {
  return eventsData.find(event => event.id.toLowerCase() === slug.toLowerCase())
}
