import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) notFound()

  const date = new Date(post.created_at).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm opacity-40 hover:opacity-80 transition-opacity mb-8">
        <ArrowLeft size={14} />
        galleria
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-light tracking-wide">{post.title}</h1>
        <p className="text-xs mt-2 opacity-30 tracking-widest">{date}</p>
        {post.description && (
          <p className="mt-4 opacity-60 leading-relaxed max-w-2xl">{post.description}</p>
        )}
      </header>

      {/* Foto copertina */}
      <div className="mb-4 rounded-sm overflow-hidden">
        <Image
          src={post.cover_url}
          alt={post.title}
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Foto aggiuntive */}
      {post.photos && post.photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {post.photos.map((url: string, i: number) => (
            <div key={i} className="rounded-sm overflow-hidden">
              <Image
                src={url}
                alt={`${post.title} ${i + 2}`}
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
