'use client'
// src/app/admin/dashboard/page.tsx
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { formatDate } from '@/lib/utils'
import type { DashboardStats } from '@/types'

function StatCard({ label, value, icon, sub }: { label: string; value: number | string; icon: string; sub?: string }) {
  return (
    <div className="bg-ivory border border-rose-gold/20 p-6 flex items-start gap-4">
      <span className="text-2xl text-rose-gold mt-0.5">{icon}</span>
      <div>
        <p className="text-3xl font-display text-burgundy font-bold">{value}</p>
        <p className="text-[11px] tracking-[2px] uppercase text-[#6b3a45] font-sans font-light mt-1">{label}</p>
        {sub && <p className="text-xs text-[#c9a0aa] mt-0.5 font-sans">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label">Admin</p>
          <h1 className="font-display text-4xl italic text-burgundy">Dashboard</h1>
          <p className="text-sm text-[#c9a0aa] font-sans font-light mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-serif italic text-[#c9a0aa] text-lg">Loading…</div>
        ) : stats ? (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <StatCard label="Total Poems" value={stats.totalPoems} icon="✦" />
              <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} icon="⊙" />
              <StatCard label="Favourites" value={stats.totalFavourites.toLocaleString()} icon="♥" />
              <StatCard label="Total Notes" value={stats.totalNotes} icon="♡" sub={`${stats.pendingNotes} pending review`} />
              <StatCard label="Photos" value={stats.totalPhotos} icon="⊹" />
            </div>

            {/* Two columns: recent poems + category views */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent poems */}
              <div className="bg-ivory border border-rose-gold/20 p-6">
                <h2 className="font-display text-xl italic text-burgundy mb-5">Recent Poems</h2>
                <div className="space-y-3">
                  {stats.recentPoems.map(poem => (
                    <div key={poem._id} className="flex items-center justify-between py-2 border-b border-rose-gold/10 last:border-0">
                      <div>
                        <p className="font-serif italic text-[#2d1a1f] text-sm">{poem.title}</p>
                        <p className="text-[10px] tracking-[1px] text-[#c9a0aa] font-sans font-light">{poem.category} · {formatDate(poem.createdAt)}</p>
                      </div>
                      <span className="text-xs text-[#c9a0aa] font-sans">{poem.views} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category performance */}
              <div className="bg-ivory border border-rose-gold/20 p-6">
                <h2 className="font-display text-xl italic text-burgundy mb-5">Views by Category</h2>
                <div className="space-y-3">
                  {stats.viewsByCategory.map(({ category, views }) => {
                    const max = Math.max(...stats.viewsByCategory.map(c => c.views), 1)
                    const pct = Math.round((views / max) * 100)
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] tracking-[1px] uppercase text-[#6b3a45] font-sans font-light">{category}</span>
                          <span className="text-[11px] text-[#c9a0aa] font-sans">{views}</span>
                        </div>
                        <div className="h-1.5 bg-rose-gold/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-burgundy to-rose-gold rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Pending notes alert */}
            {stats.pendingNotes > 0 && (
              <div className="mt-6 flex items-center justify-between bg-amber-50 border border-amber-200 px-5 py-4">
                <p className="text-sm text-amber-800 font-sans">
                  <strong>{stats.pendingNotes}</strong> note{stats.pendingNotes > 1 ? 's' : ''} waiting for review
                </p>
                <a href="/admin/notes" className="text-[11px] tracking-[2px] uppercase text-amber-700 hover:text-amber-900 transition-colors font-sans font-light">
                  Review →
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-[#c9a0aa] font-serif italic">Could not load stats.</p>
        )}
      </div>
    </AdminShell>
  )
}
