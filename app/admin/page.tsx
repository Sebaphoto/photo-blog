import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react'
import AdminSignOut from '@/components/AdminSignOut'
import type { Post } from '@/lib/supabase'

async function getAllPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminPage() {
  const posts = await getAllPosts()
  const published = posts.filter((p) => p.published).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-light tracking-wider">Pannello admin</h1>
          <p className="text-xs opacity-30 mt-1">{published} pubblicati · {posts.length - published} bozze</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/upload"
            className="flex items-center gap-2 bg-accent text-surface text-sm font-medium px-4 py-2 rounded hover:bg-accent/90 transition-colors"
          >
            <Plus size={14} />
            Nuovo post
          </Link>
          <AdminSignOut />
        </div>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="text-center py-16 opacity-30 text-sm">
            Nessun post ancora. Crea il primo!
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded flex items-center gap-4 p-3">
            <div className="w-16 h-12 relative rounded overflow-hidden flex-shrink-0">
              <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{post.title}</p>
              <p className="text-xs opacity-40 mt-0.5">
                {new Date(post.created_at).toLocaleDateString('it-IT')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                {post.published ? 'pubblicato' : 'bozza'}
              </span>
              <Link href={`/admin/upload?edit=${post.id}`} className="p-1.5 opacity-50 hover:opacity-100 transition-opacity">
                <Pencil size={14} />
              </Link>
              <Link href={`/gallery/${post.id}`} target="_blank" className="p-1.5 opacity-50 hover:opacity-100 transition-opacity">
                {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
