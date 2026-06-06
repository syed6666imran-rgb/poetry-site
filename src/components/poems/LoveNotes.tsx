'use client'
// src/components/poems/LoveNotes.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { INote } from '@/types'

interface Props { initialNotes: INote[] }

export default function LoveNotes({ initialNotes }: Props) {
  const [notes, setNotes] = useState<INote[]>(initialNotes)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!text.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.success) {
      setText('')
      toast('Your note has been left ♥')
    } else {
      toast(data.error ?? 'Something went wrong')
    }
  }

  return (
    <section
      id="notes"
      className="py-24 px-5"
      style={{ background: '#1E293B' }}
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Anonymous Notes</p>
          <h2 className="font-display text-4xl md:text-5xl italic text-soft-pink mb-3 leading-tight">
            Leave a Memory
          </h2>
          <p className="font-serif italic text-soft-pink/40 text-lg">
            Drop a quiet word into the night.
          </p>
        </motion.div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-md mx-auto mb-14"
      >
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write something beautiful… (anonymous)"
          maxLength={500}
          rows={4}
          className="w-full px-5 py-4 font-serif italic text-soft-pink text-base leading-relaxed resize-none outline-none transition-colors duration-200"
          style={{
            background: 'rgba(255,253,248,.05)',
            border: '1px solid rgba(212,163,115,.2)',
            color: 'rgba(248,232,232,.85)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,163,115,.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(212,163,115,.2)')}
        />
        <div className="flex justify-between items-center mt-1 mb-3">
          <span className="text-[11px] text-[#c9a0aa]/50 font-sans font-light">{text.length}/500</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="w-full py-3 text-[11px] tracking-[3px] uppercase text-rose-gold transition-all duration-200 font-sans font-light disabled:opacity-40"
          style={{ background: 'transparent', border: '1px solid rgba(212,163,115,.35)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,163,115,.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {submitting ? 'Leaving…' : 'Leave Your Note →'}
        </button>
      </motion.div>

      {/* Notes wall */}
      {notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {notes.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="p-5 relative transition-all duration-300 hover:opacity-90"
              style={{
                background: 'rgba(255,253,248,.05)',
                border: '1px solid rgba(212,163,115,.12)',
              }}
            >
              <p className="font-serif italic text-soft-pink/70 text-sm leading-relaxed">
                &ldquo;{note.text}&rdquo;
              </p>
              <span className="absolute bottom-3 right-4 text-rose-gold/40 text-xs">♥</span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
