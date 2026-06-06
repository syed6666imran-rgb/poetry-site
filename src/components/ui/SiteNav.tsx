'use client'
// src/components/ui/SiteNav.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import PrivateLetter from '@/components/poems/PrivateLetter'

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [privateOpen, setPrivateOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#featured', label: 'Featured' },
    { href: '#library', label: 'Poems' },
    { href: '#story', label: 'Our Story' },
    { href: '#notes', label: 'Leave a Note' },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-[100] px-8 md:px-10 py-5 flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'bg-ivory/90 backdrop-blur-md border-b border-burgundy/10' : ''
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Link href="/" className="font-display text-xl italic text-burgundy tracking-wide">
          Letters to My Love
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[11px] tracking-[2px] uppercase text-[#6b3a45] hover:text-burgundy transition-colors font-sans font-light"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => setPrivateOpen(true)}
            className="text-[11px] tracking-[2px] uppercase text-rose-gold hover:text-burgundy transition-colors font-sans font-light"
          >
            Private ♥
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-burgundy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 inset-x-0 z-[99] bg-ivory/95 backdrop-blur-md border-b border-burgundy/10 px-8 py-6 flex flex-col gap-4"
          >
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-[11px] tracking-[2px] uppercase text-[#6b3a45] font-sans font-light py-1"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setPrivateOpen(true) }}
              className="text-[11px] tracking-[2px] uppercase text-rose-gold font-sans font-light py-1 text-left"
            >
              Private ♥
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PrivateLetter open={privateOpen} onClose={() => setPrivateOpen(false)} />
    </>
  )
}
