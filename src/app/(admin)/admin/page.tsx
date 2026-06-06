import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch stats in parallel
  const [
    { count: totalOrders },
    { count: totalCustomers },
    { count: totalProducts },
    { data: recentOrders },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
  ])

  const { data: revenue } = await supabase
    .from('orders')
    .select('total')
    .eq('payment_status', 'paid')

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) ?? 0

  const STATS = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Orders',  value: (totalOrders ?? 0).toString(), icon: ShoppingCart, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20', href: '/admin/orders' },
    { label: 'Customers',     value: (totalCustomers ?? 0).toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', href: '/admin/customers' },
    { label: 'Active Products', value: (totalProducts ?? 0).toString(), icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', href: '/admin/products' },
  ]

  const STATUS_COLORS: Record<string, string> = {
    pending:         'badge-warning',
    payment_pending: 'badge-warning',
    confirmed:       'badge-cyan',
    processing:      'badge-info',
    shipped:         'badge-info',
    delivered:       'badge-success',
    cancelled:       'badge-error',
    refunded:        'badge-error',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Rahul.</p>
      </div>

      {/* Alert for pending orders */}
      {(pendingCount ?? 0) > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/30">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <p className="text-sm text-amber-300">
            You have <strong>{pendingCount}</strong> confirmed order(s) awaiting processing.{' '}
            <Link href="/admin/orders?status=confirmed" className="underline hover:text-amber-200">View orders →</Link>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map(stat => (
          <div key={stat.label}>
            {stat.href ? (
              <Link href={stat.href}>
                <div className={`glow-card p-5 hover:border-brand-medium transition-all`}>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Product',   href: '/admin/products/new',  color: 'brand' },
          { label: 'New Blog Post', href: '/admin/blog/new',      color: 'brand' },
          { label: 'Add Media',     href: '/admin/media',         color: 'brand' },
          { label: 'Site Settings', href: '/admin/settings',      color: 'brand' },
        ].map(a => (
          <Link key={a.label} href={a.href}
            className="p-4 rounded-xl bg-surface-800 border border-brand-subtle hover:border-brand-medium hover:bg-surface-700 transition-all text-sm font-medium text-slate-300 hover:text-white text-center">
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-brand-subtle">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-subtle">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-brand-400 hover:text-brand-300 font-medium">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-300">{order.customer_name}</td>
                    <td className="py-3 text-white font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className={STATUS_COLORS[order.status] || 'badge-info'}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.created_at, 'MMM d')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-600 py-8">No orders yet</p>
        )}
      </div>
    </div>
  )
}
