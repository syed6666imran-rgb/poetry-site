'use client'
// src/components/admin/AdminShell.tsx
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/admin/poems', label: 'Poems', icon: '✦' },
  { href: '/admin/notes', label: 'Notes', icon: '♡' },
  { href: '/admin/gallery', label: 'Gallery', icon: '⊹' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast('Goodbye ♥')
    router.push('/admin/login')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-ivory border-r border-rose-gold/20 w-56 shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-rose-gold/15">
        <p className="font-display text-lg italic text-burgundy">Letters to My Love</p>
        <p className="text-[10px] tracking-[2px] uppercase text-[#c9a0aa] mt-0.5 font-sans font-light">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
          >
            <span className="text-rose-gold text-base w-5 text-center">{item.icon}</span>
            <span className="font-sans font-light tracking-wide text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-rose-gold/15 space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-[11px] tracking-[1px] text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light"
        >
          <span>↗</span> View Site
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[11px] tracking-[1px] text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light"
        >
          <span>←</span> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-midnight/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-ivory border-b border-rose-gold/15">
          <button onClick={() => setSidebarOpen(true)} className="text-burgundy text-lg">☰</button>
          <p className="font-display italic text-burgundy text-base">Admin</p>
          <span />
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
