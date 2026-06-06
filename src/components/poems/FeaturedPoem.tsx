'use client'
// src/components/poems/FeaturedPoem.tsx
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { IPoem } from '@/types'
import PoemModal from './PoemModal'

interface Props { poem: IPoem }

export default function FeaturedPoem({ poem }: Props) {
  const [visible, setVisible] = useState(false)
  const [faved, setFaved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  async function handleFav() {
    if (faved) return
    setFaved(true)
    await fetch(`/api/poems/${poem._id}/favourite`, { method: 'POST' })
    toast('Poem added to your heart ♥')
  }

  function handleShare() {
    const url = `${window.location.origin}/poems/${poem._id}`
    navigator.clipboard?.writeText(url)
    toast('Link copied to clipboard')
  }

  return (
    <section id="featured" className="py-24 px-5 bg-cream">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Featured</p>
          <h2 className="section-title">Poem of the Season</h2>
          <div className="section-divider" />
        </motion.div>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="max-w-2xl mx-auto relative"
      >
        {/* Glow border */}
        <div className="absolute -inset-px bg-gradient-to-br from-rose-gold/30 via-transparent to-rose-gold/20 rounded-sm pointer-events-none" />
        <div className="absolute inset-2 border border-rose-gold/10 pointer-events-none rounded-sm" />

        {/* Card */}
        <div className="relative bg-ivory/70 backdrop-blur-sm border border-rose-gold/25 px-10 py-14 md:px-16 text-center">
          <span className="category-badge mb-6 inline-block">{poem.category}</span>
          <h3 className="font-display text-3xl md:text-4xl italic text-burgundy mb-2 leading-tight">
            {poem.title}
          </h3>
          <p className="text-[11px] tracking-[1px] text-[#c9a0aa] mb-10 font-sans font-light">
            {poem.readingTime} min read
          </p>

          <div className="poem-lines">
            {poem.lines.map((line, i) =>
              line ? (
                <p key={i} className="font-serif text-lg leading-loose text-[#2d1a1f]">{line}</p>
              ) : (
                <div key={i} className="h-4" />
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-6 mt-10 flex-wrap">
            <button
              onClick={handleFav}
              className={`flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-sans font-light transition-colors ${faved ? 'text-burgundy' : 'text-[#c9a0aa] hover:text-burgundy'}`}
            >
              <span className="text-base">{faved ? '♥' : '♡'}</span> Favourite
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light"
            >
              <span className="text-base">⬡</span> Share
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light"
            >
              <span className="text-base">⊙</span> Reading Mode
            </button>
          </div>
        </div>
      </motion.div>

      <PoemModal poem={poem} open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
