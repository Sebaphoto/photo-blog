'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) toast.error('Credenziali non valide')
    else router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center star-bg pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/40 to-surface pointer-events-none" />
      <div className="relative w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <span className="text-star text-2xl">✦</span>
          <h1 className="font-serif text-3xl font-light text-white mt-3 tracking-wider">Accesso</h1>
          <div className="gold-line w-16 mx-auto mt-4" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs opacity-40 mb-1.5 tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors text-white placeholder-white/20"
              placeholder="tua@email.com"
            />
          </div>
          <div>
            <label className="block text-xs opacity-40 mb-1.5 tracking-widest uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors text-white placeholder-white/20"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase py-3 hover:bg-gold/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Accesso...</> : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
