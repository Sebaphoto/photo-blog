import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Sebas Nightsky',
  description: 'Astrophotography by Sebastiano — capturing the universe, one frame at a time.',
  openGraph: {
    title: 'Sebas Nightsky',
    description: 'Astrophotography by Sebastiano',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-surface text-white">
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#0c0c18', color: '#fff', border: '1px solid #1a1a2e' },
          }}
        />
      </body>
    </html>
  )
}
