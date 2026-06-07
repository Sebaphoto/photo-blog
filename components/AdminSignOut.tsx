'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-1.5 text-sm opacity-40 hover:opacity-80 transition-opacity"
    >
      <LogOut size={14} />
      esci
    </button>
  )
}
