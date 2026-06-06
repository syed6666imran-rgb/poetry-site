'use client'
// src/app/admin/notes/page.tsx
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'
import type { INote } from '@/types'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<INote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('pending')

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    const url = filter === 'all' ? '/api/notes' : `/api/notes?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) setNotes(data.data)
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) {
      toast(status === 'approved' ? 'Note approved ♥' : 'Note rejected')
      fetchNotes()
    }
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { toast('Note deleted'); fetchNotes() }
  }

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
  ]

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="section-label">Admin</p>
          <h1 className="font-display text-4xl italic text-burgundy">Love Notes</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 text-[11px] tracking-[2px] uppercase border transition-all duration-200 font-sans font-light ${
                filter === f.value
                  ? 'bg-burgundy text-soft-pink border-burgundy'
                  : 'text-[#6b3a45] border-burgundy/20 hover:border-burgundy/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 font-serif italic text-[#c9a0aa]">Loading…</div>
        ) : notes.length === 0 ? (
          <p className="text-center py-16 font-serif italic text-[#c9a0aa]">
            No {filter === 'all' ? '' : filter} notes.
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note._id} className="bg-ivory border border-rose-gold/20 p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <p className="font-serif italic text-[#2d1a1f] leading-relaxed mb-2">
                    &ldquo;{note.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`badge-${note.status}`}>{note.status}</span>
                    <span className="text-[11px] text-[#c9a0aa] font-sans font-light">{formatDate(note.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {note.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(note._id, 'approved')}
                      className="text-[11px] tracking-[1px] uppercase text-emerald-600 hover:text-emerald-800 transition-colors font-sans font-light px-3 py-1 border border-emerald-200 hover:border-emerald-400"
                    >
                      Approve
                    </button>
                  )}
                  {note.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(note._id, 'rejected')}
                      className="text-[11px] tracking-[1px] uppercase text-amber-600 hover:text-amber-800 transition-colors font-sans font-light px-3 py-1 border border-amber-200 hover:border-amber-400"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-[11px] tracking-[1px] uppercase text-red-400 hover:text-red-600 transition-colors font-sans font-light px-3 py-1 border border-red-100 hover:border-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
