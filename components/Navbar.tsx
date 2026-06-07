'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-star text-lg">✦</span>
          <span className="font-serif text-xl font-light tracking-[0.15em] text-white group-hover:text-star transition-colors">
            SEBAS NIGHTSKY
          </span>
        </Link>

        <nav className="flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
          <Link
            href="/"
            className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
          >
            Galleria
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="text-gold hover:text-gold/80 transition-colors">
              Admin
            </Link>
          ) : (
            <Link href="/login" className="text-white/40 hover:text-white/80 transition-colors">
              Accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
