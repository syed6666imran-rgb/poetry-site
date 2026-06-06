'use client'
// src/components/poems/QuoteSection.tsx
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { DAILY_QUOTES } from '@/lib/utils'

export default function QuoteSection() {
  const [quote, setQuote] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const idx = new Date().getDate() % DAILY_QUOTES.length
    setQuote(DAILY_QUOTES[idx])
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="quote-section"
      className="py-20 px-6 text-center relative overflow-hidden"
      style={{ background: '#1E293B' }}
    >
      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A373' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}
      />
      <div ref={ref} className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="font-display text-7xl text-rose-gold opacity-30 leading-none mb-2">&ldquo;</div>
          <p className="font-serif italic text-soft-pink/90 leading-relaxed mb-5"
            style={{ fontSize: 'clamp(18px,2.8vw,28px)' }}>
            {quote}
          </p>
          <p className="text-[11px] tracking-[3px] uppercase text-rose-gold/60 font-sans font-light">
            — Daily Whisper
          </p>
        </motion.div>
      </div>
    </section>
  )
}
