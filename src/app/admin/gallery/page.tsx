'use client'
// src/app/admin/gallery/page.tsx
import { useEffect, useState, useCallback, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import Image from 'next/image'
import type { IPhoto } from '@/types'

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<IPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [editCaption, setEditCaption] = useState<{ id: string; value: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/photos')
    const data = await res.json()
    if (data.success) setPhotos(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Please upload a JPEG, PNG, or WebP image'); return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('caption', caption)
    const res = await fetch('/api/photos', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.success) {
      toast('Photo uploaded ⊹')
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      fetchPhotos()
    } else {
      toast(data.error ?? 'Upload failed')
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { toast('Photo deleted'); fetchPhotos() }
    else toast(data.error ?? 'Delete failed')
  }

  async function saveCaption(id: string, value: string) {
    const res = await fetch(`/api/photos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: value }),
    })
    const data = await res.json()
    if (data.success) {
      toast('Caption saved')
      setEditCaption(null)
      fetchPhotos()
    }
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="section-label">Admin</p>
          <h1 className="font-display text-4xl italic text-burgundy">Gallery</h1>
        </div>

        {/* Upload area */}
        <div className="bg-ivory border border-rose-gold/20 p-6 mb-8">
          <h2 className="font-display text-xl italic text-burgundy mb-4">Upload Photo</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="label-base">Caption (optional)</label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="input-base"
                placeholder="A quiet moment in the garden…"
              />
            </div>
            <div className="flex flex-col justify-end">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`btn-primary inline-block text-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {uploading ? 'Uploading…' : '↑ Choose File'}
              </label>
            </div>
          </div>
          <p className="text-[11px] text-[#c9a0aa] font-sans font-light mt-3">
            Supports JPEG, PNG, WebP. Images are optimised and stored on Cloudinary.
          </p>
        </div>

        {/* Photos grid */}
        {loading ? (
          <div className="text-center py-20 font-serif italic text-[#c9a0aa]">Loading…</div>
        ) : photos.length === 0 ? (
          <p className="text-center py-16 font-serif italic text-[#c9a0aa]">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo._id} className="group relative bg-ivory border border-rose-gold/15 overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? 'Photo'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>

                {/* Caption & actions */}
                <div className="p-3">
                  {editCaption?.id === photo._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editCaption.value}
                        onChange={e => setEditCaption({ id: photo._id, value: e.target.value })}
                        className="flex-1 text-xs border border-rose-gold/30 px-2 py-1 outline-none font-serif italic bg-transparent"
                        onKeyDown={e => { if (e.key === 'Enter') saveCaption(photo._id, editCaption.value) }}
                        autoFocus
                      />
                      <button onClick={() => saveCaption(photo._id, editCaption.value)} className="text-[10px] text-emerald-600 font-sans">✓</button>
                      <button onClick={() => setEditCaption(null)} className="text-[10px] text-[#c9a0aa] font-sans">✕</button>
                    </div>
                  ) : (
                    <p
                      className="text-xs font-serif italic text-[#6b3a45] truncate cursor-pointer hover:text-burgundy transition-colors"
                      onClick={() => setEditCaption({ id: photo._id, value: photo.caption ?? '' })}
                      title="Click to edit caption"
                    >
                      {photo.caption || <span className="text-[#c9a0aa]">Add caption…</span>}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => setEditCaption({ id: photo._id, value: photo.caption ?? '' })}
                      className="text-[10px] tracking-[1px] uppercase text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(photo._id)}
                      className="text-[10px] tracking-[1px] uppercase text-red-300 hover:text-red-500 transition-colors font-sans font-light"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
