'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const TINDIE_STORE = 'https://www.tindie.com/stores/c1ph3r_fsocitey/'

const NAV_LINKS = [
  { href: '/about',    label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/media',    label: 'Media' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-surface-900/95 backdrop-blur-md border-b border-brand-subtle shadow-card'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="C1ph3r Fsociety" className="w-8 h-8 rounded-lg object-cover" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-sm tracking-tight">C1PH3R</span>
              <span className="text-brand-400 text-xs font-medium tracking-widest uppercase">Fsociety</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname?.startsWith(link.href)
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Store link → /store showcase page */}
            <Link
              href="/store"
              className={cn(
                'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                pathname?.startsWith('/store')
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
              )}
            >
              Store
            </Link>

            {/* Buy on Tindie CTA */}
            <a
              href={TINDIE_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-400 shadow-glow transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buy on Tindie
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-surface-900/98 backdrop-blur-md border-t border-brand-subtle">
          <div className="section-container py-4 flex flex-col gap-1">
            <a
              href={TINDIE_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-brand-500 text-white mb-2"
            >
              <ExternalLink className="w-4 h-4" />
              Buy on Tindie
            </a>
            <Link
              href="/store"
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname?.startsWith('/store')
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
              )}
            >
              Store (Product Info)
            </Link>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname?.startsWith(link.href)
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
