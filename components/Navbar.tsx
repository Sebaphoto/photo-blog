'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, LogIn, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <header className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-surface/90">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide hover:opacity-70 transition-opacity">
          <Camera size={18} />
          <span>archivio</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`hover:opacity-70 transition-opacity ${pathname === '/' ? 'opacity-100' : 'opacity-50'}`}
          >
            galleria
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <LayoutDashboard size={14} />
              admin
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
              <LogIn size={14} />
              accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
