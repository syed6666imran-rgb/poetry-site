'use client'
// src/app/admin/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) {
      toast('Welcome back ♥')
      router.push('/admin/dashboard')
    } else {
      toast(data.error ?? 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display text-2xl italic text-burgundy mb-1">Letters to My Love</p>
          <p className="text-[11px] tracking-[3px] uppercase text-[#c9a0aa] font-sans font-light">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-rose-gold/25 bg-ivory p-8 space-y-5">
          <div>
            <label className="label-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-base"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="label-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-[11px] tracking-[2px] uppercase text-[#c9a0aa] hover:text-burgundy transition-colors font-sans font-light">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  )
}
