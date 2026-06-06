'use client'
// src/components/poems/PoetryLibrary.tsx
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { IPoem } from '@/types'
import { POEM_CATEGORIES } from '@/lib/utils'
import PoemModal from './PoemModal'

interface Props { initialPoems: IPoem[] }

export default function PoetryLibrary({ initialPoems }: Props) {
  const [poems, setPoems] = useState<IPoem[]>(initialPoems)
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [selectedPoem, setSelectedPoem] = useState<IPoem | null>(null)
  const [favourites, setFavourites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const fetchPoems = useCallback(async (cat: string, q: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (cat !== 'All') params.set('category', cat)
    if (q) params.set('search', q)
    const res = await fetch(`/api/poems?${params}`)
    const data = await res.json()
    if (data.success) setPoems(data.data.items)
    setLoading(false)
  }, [])

  function handleFilter(cat: string) {
    setFilter(cat)
    fetchPoems(cat, search)
  }

  function handleSearch(q: string) {
    setSearch(q)
    fetchPoems(filter, q)
  }

  async function toggleFav(poem: IPoem, e: React.MouseEvent) {
    e.stopPropagation()
    if (favourites.has(poem._id)) return
    setFavourites(prev => new Set([...prev, poem._id]))
    await fetch(`/api/poems/${poem._id}/favourite`, { method: 'POST' })
    toast('Added to favourites ♥')
  }

  return (
    <section id="library" className="py-24 px-5 bg-ivory">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">The Collection</p>
          <h2 className="section-title">Poetry Library</h2>
          <div className="section-divider" />
        </motion.div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          placeholder="Search poems…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="input-base pr-10"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-gold text-xs">✦</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {['All', ...POEM_CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`px-5 py-2 text-[11px] tracking-[2px] uppercase border transition-all duration-200 font-sans font-light ${
              filter === cat
                ? 'bg-burgundy text-soft-pink border-burgundy'
                : 'bg-transparent text-[#6b3a45] border-burgundy/20 hover:bg-burgundy hover:text-soft-pink hover:border-burgundy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-[#c9a0aa] font-serif italic text-lg">
          Gathering poems…
        </div>
      ) : poems.length === 0 ? (
        <div className="text-center py-16 text-[#c9a0aa] font-serif italic text-lg">
          No poems found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {poems.map((poem, i) => (
            <motion.div
              key={poem._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => setSelectedPoem(poem)}
              className="card-base card-hover relative overflow-hidden px-7 py-8 cursor-pointer group"
            >
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-burgundy to-rose-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <p className="poem-card-cat text-[10px] tracking-[3px] uppercase text-rose-gold mb-2 font-sans font-light">
                {poem.category}
              </p>
              <h3 className="font-display text-xl italic text-burgundy mb-3 leading-tight">
                {poem.title}
              </h3>
              <p className="font-serif italic text-[#6b3a45] text-sm leading-relaxed mb-5 line-clamp-3">
                &ldquo;{poem.excerpt}&rdquo;
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c9a0aa] font-sans font-light tracking-wide">
                  {poem.readingTime} min
                </span>
                <button
                  onClick={e => toggleFav(poem, e)}
                  className={`text-base transition-colors ${favourites.has(poem._id) ? 'text-burgundy' : 'text-[#c9a0aa] hover:text-burgundy'}`}
                >
                  {favourites.has(poem._id) ? '♥' : '♡'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <PoemModal poem={selectedPoem} open={!!selectedPoem} onClose={() => setSelectedPoem(null)} />
    </section>
  )
}
