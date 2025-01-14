import Link from 'next/link'
import { Download } from 'lucide-react'

const rules = [
  { id: 1, title: 'Team Composition', description: 'Each team must consist of 3-5 members from the same institution.' },
  { id: 2, title: 'Robot Specifications', description: 'Robots must not exceed 50cm in any dimension and must weigh less than 5kg.' },
  { id: 3, title: 'Battle Rules', description: 'Matches will be 3 minutes long. The robot that immobilizes the opponent or pushes it out of the arena wins.' },
  { id: 4, title: 'Safety Regulations', description: 'All robots must have a clearly visible power switch and must not use hazardous materials.' },
]

export default function EventDetails() {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-orbitron text-neon-green mb-8 text-center">Event Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-electric-blue mb-4">{rule.title}</h3>
              <p className="text-gray-300">{rule.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/rulebook.pdf" className="inline-flex items-center bg-neon-green text-black font-bold py-3 px-6 rounded-full hover:bg-electric-blue transition-colors duration-200">
            <Download size={20} className="mr-2" />
            Download Full Rulebook
          </Link>
        </div>
      </div>
    </section>
  )
}

