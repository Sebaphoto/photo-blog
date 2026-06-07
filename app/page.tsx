import { supabase } from '@/lib/supabase'
import MasonryGallery from '@/components/MasonryGallery'
import type { Post } from '@/lib/supabase'

export const revalidate = 60

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data ?? []
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 star-bg overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-star text-xs tracking-[0.4em] uppercase mb-6 opacity-70">
            ✦ Astrophotography ✦
          </p>
          <h1 className="font-serif text-6xl md:text-8xl font-light text-white text-glow leading-none mb-6">
            Sebas<br />
            <span className="italic text-star">Nightsky</span>
          </h1>
          <div className="gold-line w-32 mx-auto my-8" />
          <p className="text-white/50 text-sm tracking-widest max-w-md mx-auto leading-relaxed">
            Capturing the universe, one frame at a time.<br />
            From the Milky Way to distant nebulae.
          </p>
          <a
            href="#gallery"
            className="inline-block mt-12 text-xs tracking-[0.3em] uppercase text-gold border border-gold/30 px-8 py-3 hover:bg-gold/10 transition-colors"
          >
            Esplora la galleria
          </a>
        </div>

        {/* Freccia scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10l7 7 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">Portfolio</p>
          <h2 className="font-serif text-4xl font-light text-white">Il mio archivio</h2>
          <div className="gold-line w-24 mx-auto mt-4" />
          <p className="text-white/30 text-xs mt-4 tracking-widest">{posts.length} {posts.length === 1 ? 'scatto' : 'scatti'}</p>
        </div>
        <MasonryGallery posts={posts} />
      </section>

      {/* Footer */}
      <footer className="border-t border-border text-center py-10">
        <span className="text-star text-lg">✦</span>
        <p className="font-serif text-white/20 text-sm mt-2 tracking-widest">SEBAS NIGHTSKY</p>
        <p className="text-white/10 text-xs mt-1">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
