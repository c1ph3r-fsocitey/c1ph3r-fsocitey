import type { Metadata } from 'next'
import { Package, ShoppingCart, Users, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Rahul.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue',    value: '—', icon: DollarSign, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Total Orders',     value: '—', icon: ShoppingCart, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20', href: '/admin/orders' },
          { label: 'Customers',        value: '—', icon: Users,        color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20',   href: '/admin/customers' },
          { label: 'Active Products',  value: '9', icon: Package,      color: 'text-purple-400',bg: 'bg-purple-500/10 border-purple-500/20',href: '/admin/products' },
        ].map(stat => (
          <div key={stat.label}>
            {stat.href ? (
              <Link href={stat.href}>
                <div className="glow-card p-5 hover:border-brand-medium transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </Link>
            ) : (
              <div className="glow-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Manage Products',  href: '/admin/products' },
            { label: 'View Orders',      href: '/admin/orders' },
            { label: 'View Customers',   href: '/admin/customers' },
            { label: 'Site Settings',    href: '/admin/settings' },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="p-4 rounded-xl bg-surface-800 border border-brand-subtle hover:border-brand-medium hover:bg-surface-700 transition-all text-sm font-medium text-slate-300 hover:text-white text-center">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="glow-card p-6">
        <h2 className="font-bold text-white mb-3">Getting Started</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your database is set up and all 9 products are loaded.
          Next steps: set up email (SMTP) for order confirmations,
          complete Razorpay KYC for Indian payments, and add your own photos to the media gallery.
        </p>
      </div>
    </div>
  )
}
