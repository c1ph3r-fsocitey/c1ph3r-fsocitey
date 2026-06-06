import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://c1ph3rfsociety.com'),
  title: {
    default: 'C1ph3r Fsociety — Cybersecurity Hardware Research',
    template: '%s | C1ph3r Fsociety',
  },
  description:
    'We design, build, and sell offensive security hardware for ethical hackers, penetration testers, and security researchers. Based in Delhi, India.',
  keywords: [
    'cybersecurity hardware', 'penetration testing tools', 'BLE jammer',
    'WiFi deauther', 'RF tools', 'ESP32 hacking', 'security research',
    'ethical hacking', 'red team tools', 'C1ph3r Fsociety',
  ],
  authors: [{ name: 'Rahul Thareja', url: 'https://c1ph3rfsociety.com/about' }],
  creator: 'C1ph3r Fsociety',
  publisher: 'C1ph3r Fsociety',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://c1ph3rfsociety.com',
    siteName: 'C1ph3r Fsociety',
    title: 'C1ph3r Fsociety — Cybersecurity Hardware Research',
    description:
      'Offensive security hardware designed from scratch. BLE jammers, WiFi deauthers, RF tools, and educational kits for ethical hackers.',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C1ph3r Fsociety — Cybersecurity Hardware Research',
    description: 'Offensive security hardware designed from scratch.',
    images: ['/images/og-image.png'],
    creator: '@c1ph3r_fsocitey',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-900 text-slate-200 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a1520',
              color: '#e2e8f0',
              border: '1px solid rgba(26,169,189,0.25)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#1aa9bd', secondary: '#0a1520' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#0a1520' } },
          }}
        />
      </body>
    </html>
  )
}
