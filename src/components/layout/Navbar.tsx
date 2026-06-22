'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCartStore } from '@/context/cartStore'

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
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))

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
            {/* Store link */}
            <Link
              href="/store"
              className={cn(
                'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                'bg-brand-500 text-white hover:bg-brand-400 shadow-glow'
              )}
            >
              Shop
            </Link>

            {/* Cart */}
            <Link
              href="/store/cart"
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

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
            <Link
              href="/store"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-brand-500 text-white mb-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Shop
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
