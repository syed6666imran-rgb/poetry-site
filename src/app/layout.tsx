// src/app/layout.tsx
import type { Metadata } from 'next'
import { Lato, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Letters to My Love',
    template: '%s | Letters to My Love',
  },
  description: 'A collection of words written by a heart that found its home.',
  openGraph: {
    title: 'Letters to My Love',
    description: 'A collection of words written by a heart that found its home.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Letters to My Love',
    description: 'A collection of words written by a heart that found its home.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${cormorant.variable} ${playfair.variable}`}>
      <body className="bg-ivory font-sans antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#5A1E2B',
              color: '#F8E8E8',
              fontFamily: 'var(--font-lato)',
              fontSize: '12px',
              letterSpacing: '1px',
              border: '1px solid rgba(212,163,115,0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}
