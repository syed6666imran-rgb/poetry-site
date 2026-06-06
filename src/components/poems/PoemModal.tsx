'use client'
// src/components/poems/PoemModal.tsx
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { IPoem } from '@/types'

interface Props {
  poem: IPoem | null
  open: boolean
  onClose: () => void
}

export default function PoemModal({ poem, open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setProgress(Math.min(100, pct))
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [open])

  // Reset progress on new poem
  useEffect(() => { setProgress(0) }, [poem])

  return (
    <AnimatePresence>
      {open && poem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(26,10,15,.96)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-xl bg-ivory rounded-sm overflow-hidden"
            style={{ maxHeight: '85vh' }}
          >
            {/* Reading progress bar */}
            <div
              className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-burgundy to-rose-gold transition-all duration-100 z-10"
              style={{ width: `${progress}%` }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-[#c9a0aa] hover:text-burgundy transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Scrollable content */}
            <div ref={scrollRef} className="overflow-y-auto h-full px-8 py-12 md:px-14 md:py-16" style={{ maxHeight: '85vh' }}>
              <div className="text-center mb-10">
                <span className="category-badge mb-4 inline-block">{poem.category}</span>
                <h2 className="font-display text-3xl italic text-burgundy leading-tight mb-2">
                  {poem.title}
                </h2>
                <p className="text-[11px] tracking-[1px] text-[#c9a0aa] font-sans font-light">
                  {poem.readingTime} min read
                </p>
              </div>

              <div className="text-center space-y-4">
                {poem.lines.map((line, i) =>
                  line ? (
                    <p key={i} className="font-serif text-lg leading-loose text-[#2d1a1f]">{line}</p>
                  ) : (
                    <div key={i} className="h-5" />
                  )
                )}
              </div>

              <div className="mt-12 text-center">
                <div className="section-divider" />
                <p className="text-[11px] tracking-[2px] uppercase text-[#c9a0aa] font-sans font-light">
                  Letters to My Love
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
