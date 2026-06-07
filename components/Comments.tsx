'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Send } from 'lucide-react'

type Comment = {
  id: string
  name: string
  body: string
  created_at: string
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments(data ?? []))
  }, [postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !body.trim()) return
    setLoading(true)
    await supabase.from('comments').insert({ post_id: postId, name, body })
    setLoading(false)
    setSent(true)
    setName('')
    setBody('')
  }

  return (
    <div>
      <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">✦ Commenti</p>
      <h3 className="font-serif text-3xl font-light text-white mb-8">
        {comments.length > 0 ? `${comments.length} ${comments.length === 1 ? 'commento' : 'commenti'}` : 'Lascia un commento'}
      </h3>

      {/* Lista commenti */}
      {comments.length > 0 && (
        <div className="space-y-6 mb-12">
          {comments.map((c) => (
            <div key={c.id} className="border-l border-gold/30 pl-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/80 text-sm font-medium">{c.name}</span>
                <span className="text-white/20 text-xs">
                  {new Date(c.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {sent ? (
        <div className="border border-gold/20 p-6 text-center">
          <p className="text-star text-lg mb-2">✦</p>
          <p className="font-serif text-white/70 text-lg italic">Grazie per il tuo commento!</p>
          <p className="text-white/30 text-xs mt-1">Sarà visibile dopo l'approvazione.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs opacity-40 mb-1.5 tracking-widest uppercase">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors text-white placeholder-white/20"
              placeholder="Il tuo nome"
              required
            />
          </div>
          <div>
            <label className="block text-xs opacity-40 mb-1.5 tracking-widest uppercase">Messaggio</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors resize-none text-white placeholder-white/20"
              placeholder="Scrivi un commento..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-gold/10 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Invia commento
          </button>
        </form>
      )}
    </div>
  )
}
