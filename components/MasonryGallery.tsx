'use client'

import Masonry from 'react-masonry-css'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/supabase'

const breakpointCols = { default: 3, 1100: 3, 700: 2, 500: 1 }

export default function MasonryGallery({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-32 text-white/20 text-xs tracking-[0.4em] uppercase">
        nessuno scatto ancora
      </div>
    )
  }

  return (
    <Masonry breakpointCols={breakpointCols} className="masonry-grid" columnClassName="masonry-grid-col">
      {posts.map((post) => (
        <Link key={post.id} href={`/gallery/${post.id}`} className="block group photo-card relative overflow-hidden">
          <div className="relative w-full">
            <Image
              src={post.cover_url}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-400 flex items-end p-5">
              <div>
                <p className="text-star text-xs tracking-widest mb-1">✦</p>
                <h2 className="font-serif text-white text-xl font-light leading-tight">{post.title}</h2>
                {post.description && (
                  <p className="text-white/50 text-xs mt-1 line-clamp-1 tracking-wide">{post.description}</p>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </Masonry>
  )
}
