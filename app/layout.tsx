import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Il mio archivio fotografico',
  description: 'Fotografie e racconti visivi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="min-h-screen bg-surface text-accent">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#e8e0d0', border: '1px solid #2a2a2a' },
          }}
        />
      </body>
    </html>
  )
}
