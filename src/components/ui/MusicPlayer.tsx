'use client'
// src/components/ui/MusicPlayer.tsx
import { useState } from 'react'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)

  function toggle() {
    setPlaying(p => !p)
    // Wire up your own audio file: const audio = new Audio('/music/reverie.mp3')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 bg-ivory/95 border border-rose-gold/25 backdrop-blur-md shadow-lg">
      <div>
        <p className="text-[10px] tracking-[1px] text-[#6b3a45] font-sans font-light uppercase">Now playing</p>
        <p className="font-serif italic text-burgundy text-sm">Moonlit Reverie</p>
      </div>
      <button
        onClick={toggle}
        className="w-8 h-8 flex items-center justify-center border border-burgundy/20 text-burgundy text-sm transition-all hover:bg-burgundy hover:text-soft-pink"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '⏸' : '▶'}
      </button>
    </div>
  )
}
