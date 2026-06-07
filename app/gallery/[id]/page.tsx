import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'

export const revalidate = 30

async function getPost(id: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  return data
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) notFound()

  const date = new Date(post.created_at).toLocaleDateString('it-IT', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen pt-16">
      {/* Foto hero fullwidth */}
      <div className="relative w-full" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
        <Image
          src={post.cover_url}
          alt={post.title}
          width={1600}
          height={900}
          className="w-full object-cover"
          style={{ maxHeight: '90vh' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl">
          <p className="text-star text-xs tracking-[0.4em] uppercase mb-3 opacity-70">✦ Astrophotography</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-white text-glow leading-tight">
            {post.title}
          </h1>
          <p className="text-white/40 text-xs mt-4 tracking-widest">{date}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase mb-12">
          <ArrowLeft size={12} />
          Galleria
        </Link>

        {/* Descrizione */}
        {post.description && (
          <div className="mb-16">
            <div className="gold-line w-16 mb-8" />
            <p className="font-serif text-xl md:text-2xl font-light text-white/70 leading-relaxed italic">
              {post.description}
            </p>
          </div>
        )}

        {/* Foto aggiuntive */}
        {post.photos && post.photos.length > 0 && (
          <div className="space-y-4 mb-16">
            {post.photos.map((url: string, i: number) => (
              <div key={i} className="overflow-hidden">
                <Image
                  src={url}
                  alt={`${post.title} ${i + 2}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}

        {/* Divisore */}
        <div className="gold-line w-full my-16" />

        {/* Commenti */}
        <Comments postId={post.id} />
      </div>

      {/* Footer */}
      <footer className="border-t border-border text-center py-10">
        <span className="text-star text-lg">✦</span>
        <p className="font-serif text-white/20 text-sm mt-2 tracking-widest">SEBAS NIGHTSKY</p>
      </footer>
    </div>
  )
}
