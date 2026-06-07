import { supabase } from '@/lib/supabase'
import MasonryGallery from '@/components/MasonryGallery'
import type { Post } from '@/lib/supabase'

export const revalidate = 60 // aggiorna ogni minuto

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data ?? []
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase opacity-80">Archivio fotografico</h1>
        <p className="text-xs mt-2 opacity-30 tracking-widest">{posts.length} {posts.length === 1 ? 'lavoro' : 'lavori'}</p>
      </div>
      <MasonryGallery posts={posts} />
    </div>
  )
}
