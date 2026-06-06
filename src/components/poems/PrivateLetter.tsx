'use client'
// src/components/poems/PrivateLetter.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { open: boolean; onClose: () => void }

const SECRET_POEM = [
  'This was always meant for you.',
  '',
  'In every syllable I ever wrote,',
  'in every line break and every pause,',
  'I was practicing how to say your name',
  'without trembling.',
  '',
  'I never quite managed.',
  '',
  'I never wanted to.',
]

// Client-side check only — real security lives in the API / isPrivate flag
const VALID_KEYS = ['mylove', 'foryou', 'always']

export default function PrivateLetter({ open, onClose }: Props) {
  const [key, setKey] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  function handleClose() {
    onClose()
    setTimeout(() => { setKey(''); setUnlocked(false); setError(false) }, 400)
  }

  function handleUnlock() {
    if (VALID_KEYS.includes(key.trim().toLowerCase())) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 900)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[600] flex items-center justify-center p-6"
          style={{ background: 'rgba(26,10,15,.97)' }}
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-sm w-full"
          >
            <AnimatePresence mode="wait">
              {!unlocked ? (
                <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-3xl mb-5 text-rose-gold">♥</div>
                  <h2 className="font-display text-3xl italic text-soft-pink mb-3">Private Letters</h2>
                  <p className="font-serif italic text-soft-pink/40 text-base mb-8">
                    Some words are written only for you.
                  </p>
                  <input
                    type="password"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    placeholder="· · · · · ·"
                    maxLength={12}
                    className={`w-52 mx-auto block px-6 py-3 text-center font-serif italic text-soft-pink text-lg tracking-[4px] outline-none transition-colors duration-300 bg-transparent ${
                      error ? 'border-red-400/60' : 'border-rose-gold/30 focus:border-rose-gold/70'
                    } border`}
                    style={{ letterSpacing: '6px' }}
                  />
                  <div className="flex flex-col gap-3 items-center mt-5">
                    <button
                      onClick={handleUnlock}
                      className="px-10 py-3 text-[11px] tracking-[3px] uppercase text-rose-gold font-sans font-light transition-all duration-200"
                      style={{ border: '1px solid rgba(212,163,115,.4)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,163,115,.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Open →
                    </button>
                    <button onClick={handleClose} className="text-[11px] tracking-[2px] uppercase text-soft-pink/20 hover:text-soft-pink/40 transition-colors font-sans font-light">
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="poem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="text-2xl mb-6 text-rose-gold">♥</div>
                  <div className="space-y-2 mb-8">
                    {SECRET_POEM.map((line, i) =>
                      line ? (
                        <p key={i} className="font-serif italic text-soft-pink/85 text-base leading-relaxed">{line}</p>
                      ) : (
                        <div key={i} className="h-3" />
                      )
                    )}
                  </div>
                  <button onClick={handleClose} className="text-[11px] tracking-[2px] uppercase text-soft-pink/30 hover:text-soft-pink/60 transition-colors font-sans font-light">
                    Close the letter ♥
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
