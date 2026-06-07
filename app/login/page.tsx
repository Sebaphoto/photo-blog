'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.error('Credenziali non valide')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8 opacity-60">
          <Camera size={20} />
          <span className="text-sm tracking-widest uppercase">accesso</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs opacity-50 mb-1 tracking-wider">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-card border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-accent/40 transition-colors"
              placeholder="tua@email.com"
            />
          </div>

          <div>
            <label className="block text-xs opacity-50 mb-1 tracking-wider">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-card border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-accent/40 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-surface font-medium py-2.5 rounded text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> accesso...</> : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
