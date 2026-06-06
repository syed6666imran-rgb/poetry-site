'use client'
// src/app/admin/poems/page.tsx
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { POEM_CATEGORIES, formatDate } from '@/lib/utils'
import type { IPoem, PoemCategory } from '@/types'

interface FormData {
  title: string
  category: PoemCategory
  lines: string
  isFeatured: boolean
  isPrivate: boolean
}

const EMPTY_FORM: FormData = {
  title: '',
  category: 'Love',
  lines: '',
  isFeatured: false,
  isPrivate: false,
}

export default function AdminPoemsPage() {
  const [poems, setPoems] = useState<IPoem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<IPoem | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchPoems = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/poems?limit=100')
    const data = await res.json()
    if (data.success) setPoems(data.data.items)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPoems() }, [fetchPoems])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(poem: IPoem) {
    setEditing(poem)
    setForm({
      title: poem.title,
      category: poem.category,
      lines: poem.lines.join('\n'),
      isFeatured: poem.isFeatured,
      isPrivate: poem.isPrivate,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.lines.trim()) {
      toast('Title and lines are required'); return
    }
    setSaving(true)
    const body = {
      title: form.title.trim(),
      category: form.category,
      lines: form.lines.split('\n'),
      isFeatured: form.isFeatured,
      isPrivate: form.isPrivate,
    }
    const url = editing ? `/api/poems/${editing._id}` : '/api/poems'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) {
      toast(editing ? 'Poem updated ✦' : 'Poem created ✦')
      setModalOpen(false)
      fetchPoems()
    } else {
      toast(data.error ?? 'Error saving')
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/poems/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast('Poem deleted')
      setDeleteId(null)
      fetchPoems()
    } else {
      toast(data.error ?? 'Error deleting')
    }
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display text-4xl italic text-burgundy">Poems</h1>
          </div>
          <button onClick={openCreate} className="btn-primary">+ Add Poem</button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 font-serif italic text-[#c9a0aa]">Loading…</div>
        ) : (
          <div className="bg-ivory border border-rose-gold/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-gold/15">
                  {['Title', 'Category', 'Views', 'Favs', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-[#c9a0aa] font-sans font-light whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {poems.map(poem => (
                  <tr key={poem._id} className="border-b border-rose-gold/10 last:border-0 hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-serif italic text-[#2d1a1f]">{poem.title}</span>
                      {poem.isFeatured && <span className="ml-2 text-[9px] tracking-[1px] bg-rose-gold/20 text-burgundy px-1.5 py-0.5 uppercase font-sans">Featured</span>}
                    </td>
                    <td className="px-4 py-3 text-[11px] tracking-[1px] uppercase text-[#6b3a45] font-sans font-light">{poem.category}</td>
                    <td className="px-4 py-3 text-[#c9a0aa] font-sans">{poem.views}</td>
                    <td className="px-4 py-3 text-[#c9a0aa] font-sans">{poem.favourites}</td>
                    <td className="px-4 py-3">
                      {poem.isPrivate
                        ? <span className="text-[10px] tracking-[1px] uppercase px-2 py-0.5 bg-burgundy/10 text-burgundy border border-burgundy/20 font-sans">Private</span>
                        : <span className="text-[10px] tracking-[1px] uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans">Public</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#c9a0aa] font-sans whitespace-nowrap">{formatDate(poem.createdAt)}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => openEdit(poem)} className="text-[11px] tracking-[1px] uppercase text-[#6b3a45] hover:text-burgundy transition-colors font-sans font-light">Edit</button>
                      <button onClick={() => setDeleteId(poem._id)} className="text-[11px] tracking-[1px] uppercase text-red-400 hover:text-red-600 transition-colors font-sans font-light">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {poems.length === 0 && (
              <p className="text-center py-12 font-serif italic text-[#c9a0aa]">No poems yet. Add your first.</p>
            )}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-sm">
          <div className="bg-ivory border border-rose-gold/25 w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl italic text-burgundy">
                {editing ? 'Edit Poem' : 'New Poem'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#c9a0aa] hover:text-burgundy text-lg">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label-base">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="input-base"
                  placeholder="The title of your poem…"
                />
              </div>

              <div>
                <label className="label-base">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as PoemCategory }))}
                  className="input-base bg-ivory appearance-none"
                >
                  {POEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="label-base">Lines (one per line, blank line = stanza break)</label>
                <textarea
                  value={form.lines}
                  onChange={e => setForm(f => ({ ...f, lines: e.target.value }))}
                  rows={12}
                  className="input-base resize-none font-mono text-sm leading-relaxed"
                  placeholder={'I have memorized the geography of your face\nthe way cartographers memorize continents—\n\nWith reverence, and a fear of ever forgetting.'}
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="accent-burgundy w-4 h-4"
                  />
                  <span className="text-[11px] tracking-[1px] uppercase text-[#6b3a45] font-sans font-light">Featured poem</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPrivate}
                    onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
                    className="accent-burgundy w-4 h-4"
                  />
                  <span className="text-[11px] tracking-[1px] uppercase text-[#6b3a45] font-sans font-light">Private (key required)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Poem'}
                </button>
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-sm">
          <div className="bg-ivory border border-rose-gold/25 p-8 max-w-sm w-full text-center">
            <p className="font-display text-2xl italic text-burgundy mb-3">Delete Poem?</p>
            <p className="text-sm text-[#6b3a45] font-sans font-light mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => handleDelete(deleteId)} className="btn-primary bg-red-700 border-red-700 hover:bg-red-800">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
