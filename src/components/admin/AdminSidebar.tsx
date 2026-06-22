'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  FileText, Image, Mic, Settings, BarChart3, LogOut,
  Menu, X, ChevronRight, FlaskConical, UserCircle, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics',   icon: BarChart3 },
  { href: '/admin/products',  label: 'Products',    icon: Package },
  { href: '/admin/orders',    label: 'Orders',      icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers',   icon: Users },
  { href: '/admin/about',     label: 'About Page',  icon: UserCircle },
  { href: '/admin/blog',      label: 'Blog',        icon: FileText },
  { href: '/admin/research',  label: 'Research',    icon: FlaskConical },
  { href: '/admin/media',     label: 'Media',       icon: Image },
  { href: '/admin/speaking',  label: 'Speaking',    icon: Mic },
  { href: '/admin/settings',  label: 'Settings',    icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-brand-subtle">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="C1ph3r Fsociety" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <div className="font-bold text-white text-sm">C1PH3R</div>
            <div className="text-brand-400 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-surface-700'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-brand-subtle">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-surface-700 mb-1 transition-all">
          <Shield className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-800 border-r border-brand-subtle flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-surface-800 border border-brand-subtle flex items-center justify-center text-slate-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-surface-800 border-r border-brand-subtle">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
