'use client'
// src/components/poems/StoryTimeline.tsx
import { motion } from 'framer-motion'

const milestones = [
  { date: 'March 2022', memory: 'The First Glance', note: 'You turned around, and somehow the room reorganized itself around you.' },
  { date: 'May 2022', memory: 'The Walk We Took', note: 'We talked until the city went quiet and neither of us wanted to say goodnight.' },
  { date: 'December 2022', memory: 'The First Winter', note: 'I learned that cold is simply the absence of you standing beside me.' },
  { date: 'April 2023', memory: 'When You Said Yes', note: 'The word that made every poem I had ever written finally make sense.' },
  { date: 'July 2024', memory: 'Our Place', note: 'The table by the window where two coffees become one conversation that never quite ends.' },
]

export default function StoryTimeline() {
  return (
    <section
      id="story"
      className="py-24 px-5"
      style={{ background: 'linear-gradient(180deg,#FAF6F0,#F8E8E8)' }}
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Timeline</p>
          <h2 className="section-title">Our Story</h2>
          <div className="section-divider" />
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Centre line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-rose-gold to-transparent -translate-x-1/2 hidden md:block" />

        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`flex mb-14 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Dot */}
            <div className="hidden md:block absolute left-1/2 top-4 w-2.5 h-2.5 rounded-full bg-rose-gold border-2 border-ivory -translate-x-1/2 z-10" />

            {/* Content */}
            <div className={`w-full md:w-[calc(50%-2rem)] bg-ivory/90 border border-rose-gold/20 p-6 ${
              i % 2 === 0 ? 'md:mr-auto md:ml-5' : 'md:ml-auto md:mr-5'
            }`}>
              <p className="text-[10px] tracking-[3px] uppercase text-rose-gold mb-1 font-sans font-light">{m.date}</p>
              <h3 className="font-display text-lg italic text-burgundy mb-2">{m.memory}</h3>
              <p className="font-serif italic text-[#6b3a45] text-sm leading-relaxed">{m.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
