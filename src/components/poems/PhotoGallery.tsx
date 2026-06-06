'use client'
// src/components/poems/PhotoGallery.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { IPhoto } from '@/types'

interface Props { photos: IPhoto[] }

export default function PhotoGallery({ photos }: Props) {
  const [lightbox, setLightbox] = useState<IPhoto | null>(null)

  return (
    <section id="gallery" className="py-24 px-5 bg-cream">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Memories</p>
          <h2 className="section-title">Photo Gallery</h2>
          <div className="section-divider" />
        </motion.div>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-5xl mx-auto">
        {photos.map((photo, i) => (
          <motion.div
            key={photo._id}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden"
            onClick={() => setLightbox(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? 'Memory'}
              width={photo.width}
              height={photo.height}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/20 transition-all duration-300 flex items-end p-3">
              {photo.caption && (
                <p className="font-serif italic text-xs text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center p-4"
          style={{ background: 'rgba(26,10,15,.96)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-soft-pink/60 hover:text-soft-pink text-xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
            className="max-w-3xl w-full"
          >
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? ''}
              width={lightbox.width}
              height={lightbox.height}
              className="w-full object-contain max-h-[75vh]"
            />
            {lightbox.caption && (
              <p className="text-center font-serif italic text-soft-pink/60 mt-4 text-sm">
                {lightbox.caption}
              </p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}
