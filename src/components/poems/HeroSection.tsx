'use client'
// src/components/poems/HeroSection.tsx
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = starsRef.current
    if (!container) return
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div')
      s.style.cssText = `
        position:absolute;background:#fff;border-radius:50%;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        width:${1 + Math.random() * 2}px;height:${1 + Math.random() * 2}px;
        animation:twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 5}s infinite;
      `
      container.appendChild(s)
    }
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.18 + 0.4, duration: 0.7, ease: 'easeOut' },
    }),
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center text-center relative overflow-hidden px-5 py-24"
      style={{ background: 'linear-gradient(160deg,#1a0a0f 0%,#2d1020 35%,#5A1E2B 70%,#3d1520 100%)' }}
    >
      {/* Stars */}
      <div ref={starsRef} className="absolute inset-0" />

      {/* Moon */}
      <div
        className="absolute top-16 right-20 w-20 h-20 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle at 35% 35%,#fff9e8,#e8d5a0)',
          boxShadow: '0 0 40px rgba(232,208,96,.3),0 0 80px rgba(232,208,96,.1)',
        }}
      />

      {/* Glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse"
        style={{ background: 'radial-gradient(circle,rgba(212,163,115,.12) 0%,transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.p
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="section-label text-rose-gold"
        >
          A Collection of Love
        </motion.p>

        <motion.h1
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="font-display font-bold italic text-ivory leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(44px,8vw,88px)', textShadow: '0 2px 40px rgba(212,163,115,.3)' }}
        >
          Every Poem<br />Begins With You
        </motion.h1>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="font-serif italic text-soft-pink/75 mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(16px,2.5vw,22px)' }}
        >
          A collection of words written by a heart that found its home.
        </motion.p>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-3 justify-center">
          <a href="#library" className="btn-primary">Read My Poems</a>
          <a href="#notes" className="btn-outline">Write Me a Memory</a>
        </motion.div>
      </div>
    </section>
  )
}
