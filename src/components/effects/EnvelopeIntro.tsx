'use client'
// src/components/effects/EnvelopeIntro.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EnvelopeIntro() {
  const [show, setShow] = useState(true)
  const [opened, setOpened] = useState(false)
  const [letterRisen, setLetterRisen] = useState(false)

  useEffect(() => {
    // Don't show if already seen this session
    if (sessionStorage.getItem('ltml_intro_seen')) {
      setShow(false)
    }
  }, [])

  function handleOpen() {
    if (opened) return
    setOpened(true)
    setTimeout(() => setLetterRisen(true), 800)
    setTimeout(() => {
      sessionStorage.setItem('ltml_intro_seen', '1')
      setShow(false)
    }, 3400)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[1000] bg-midnight flex flex-col items-center justify-center gap-8"
        >
          {/* Envelope */}
          <div
            className="relative cursor-pointer select-none"
            style={{ width: 280, height: 180 }}
            onClick={handleOpen}
          >
            {/* Body */}
            <div
              className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#f5e6d0,#ede0c8)' }}
            >
              {/* Flap */}
              <motion.div
                animate={opened ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 0,
                  borderLeft: '140px solid transparent',
                  borderRight: '140px solid transparent',
                  borderTop: '90px solid #d4b896',
                  transformOrigin: 'top center',
                  zIndex: 2,
                }}
              />

              {/* Wax seal */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-9 h-9 rounded-full flex items-center justify-center text-rose-gold text-base font-serif"
                style={{ background: '#5A1E2B' }}
              >
                ♥
              </div>

              {/* Letter inside */}
              <motion.div
                animate={letterRisen ? { y: -24, opacity: 1 } : { y: 100, opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute bottom-3 left-4 right-4 bg-ivory px-4 py-3 text-center shadow-md"
              >
                <p className="font-serif italic text-xs text-[#2d1a1f] leading-relaxed">
                  &ldquo;For the one who unknowingly became every poem I ever wrote.&rdquo;
                </p>
              </motion.div>
            </div>
          </div>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-[#c9a0aa] text-[11px] tracking-[3px] uppercase font-sans font-light"
          >
            {opened ? 'Opening…' : 'Click to open'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
