'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  DollarSign, ShoppingCart, Users, Package,
  TrendingUp, MessageSquare, Mic, BookOpen, Image as ImageIcon,
  FlaskConical, ArrowUpRight,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
  totalProducts: number
  totalBlogPosts: number
  totalResearch: number
  totalSpeaking: number
  totalMedia: number
  unreadContacts: number
  recentOrders: {
    id: string
    order_number: string
    customer_name: string
    total: number
    status: string
    created_at: string
  }[]
  topProducts: {
    name: string
    total_sold: number
    revenue: number
  }[]
  ordersByStatus: Record<string, number>
  revenueThisMonth: number
  ordersThisMonth: number
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  shipped:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered:  'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled:  'text-red-400 bg-red-400/10 border-red-400/20',
  refunded:   'text-slate-400 bg-slate-400/10 border-slate-400/20',
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [
        ordersRes,
        customersRes,
        productsRes,
        blogRes,
        researchRes,
        speakingRes,
        mediaRes,
        contactsRes,
        recentOrdersRes,
        orderItemsRes,
        monthOrdersRes,
      ] = await Promise.all([
        supabase.from('orders').select('id, total, status, created_at'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('research_projects').select('id', { count: 'exact', head: true }),
        supabase.from('speaking_events').select('id', { count: 'exact', head: true }),
        supabase.from('media_items').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id, is_read').eq('is_read', false),
        supabase.from('orders')
          .select('id, order_number, customer_name, total, status, created_at')
          .order('created_at', { ascending: false })
          .limit(8),
        supabase.from('order_items').select('product_id, quantity, total, products(name)'),
        supabase.from('orders').select('total, status').gte('created_at', monthStart),
      ])

      const orders = ordersRes.data ?? []
      const monthOrders = monthOrdersRes.data ?? []
      const orderItems = orderItemsRes.data ?? []

      // Revenue
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, o) => sum + Number(o.total), 0)

      const revenueThisMonth = monthOrders
        .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, o) => sum + Number(o.total), 0)

      const ordersThisMonth = monthOrders.length

      // Orders by status
      const ordersByStatus: Record<string, number> = {}
      for (const o of orders) {
        ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1
      }

      // Top products by revenue
      const productMap: Record<string, { name: string; total_sold: number; revenue: number }> = {}
      for (const item of orderItems) {
        const name = (item.products as any)?.name ?? 'Unknown'
        if (!productMap[name]) productMap[name] = { name, total_sold: 0, revenue: 0 }
        productMap[name].total_sold += item.quantity
        productMap[name].revenue += Number(item.total)
      }
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customersRes.count ?? 0,
        pendingOrders: ordersByStatus['pending'] ?? 0,
        totalProducts: productsRes.count ?? 0,
        totalBlogPosts: blogRes.count ?? 0,
        totalResearch: researchRes.count ?? 0,
        totalSpeaking: speakingRes.count ?? 0,
        totalMedia: mediaRes.count ?? 0,
        unreadContacts: contactsRes.data?.length ?? 0,
        recentOrders: recentOrdersRes.data ?? [],
        topProducts,
        ordersByStatus,
        revenueThisMonth,
        ordersThisMonth,
      })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Loading stats...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glow-card p-5 h-24 animate-pulse bg-surface-800" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(2)}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your store and content.</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Revenue',
            value: fmt(stats.totalRevenue),
            sub: `${fmt(stats.revenueThisMonth)} this month`,
            icon: DollarSign,
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders,
            sub: `${stats.ordersThisMonth} this month`,
            icon: ShoppingCart,
            color: 'text-brand-400',
            bg: 'bg-brand-500/10 border-brand-500/20',
            href: '/admin/orders',
          },
          {
            label: 'Customers',
            value: stats.totalCustomers,
            sub: null,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
            href: '/admin/customers',
          },
          {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            sub: stats.pendingOrders > 0 ? 'Need attention' : 'All clear',
            icon: TrendingUp,
            color: stats.pendingOrders > 0 ? 'text-yellow-400' : 'text-green-400',
            bg: stats.pendingOrders > 0
              ? 'bg-yellow-500/10 border-yellow-500/20'
              : 'bg-green-500/10 border-green-500/20',
            href: '/admin/orders',
          },
        ].map(stat => {
          const card = (
            <div className="glow-card p-5 hover:border-brand-medium transition-all h-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              {stat.sub && <p className="text-xs text-slate-600 mt-1">{stat.sub}</p>}
            </div>
          )
          return (
            <div key={stat.label}>
              {stat.href ? <Link href={stat.href}>{card}</Link> : card}
            </div>
          )
        })}
      </div>

      {/* Orders by status + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="glow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Orders by Status</h2>
            <Link href="/admin/orders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {Object.keys(stats.ordersByStatus).length === 0 ? (
            <p className="text-slate-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`capitalize text-xs font-medium px-2.5 py-1 rounded-lg border ${STATUS_COLORS[status] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>
                    {status}
                  </span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500/60 rounded-full"
                        style={{ width: `${Math.round((count / stats.totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="glow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Top Products</h2>
            <Link href="/admin/products" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {stats.topProducts.length === 0 ? (
            <p className="text-slate-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-mono w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.total_sold} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-green-400">{fmt(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-slate-500 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between py-2.5 border-b border-brand-subtle last:border-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-500">{order.order_number}</span>
                  <span className="text-sm text-slate-200">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded border ${STATUS_COLORS[order.status] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-white w-20 text-right">${Number(order.total).toFixed(2)}</span>
                  <span className="text-xs text-slate-600 w-24 text-right">{formatDate(order.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Content stats */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Products',   value: stats.totalProducts,  icon: Package,       href: '/admin/products' },
            { label: 'Blog Posts', value: stats.totalBlogPosts, icon: BookOpen,      href: '/admin/blog' },
            { label: 'Research',   value: stats.totalResearch,  icon: FlaskConical,  href: null },
            { label: 'Speaking',   value: stats.totalSpeaking,  icon: Mic,           href: '/admin/speaking' },
            { label: 'Media',      value: stats.totalMedia,     icon: ImageIcon,     href: '/admin/media' },
          ].map(item => {
            const card = (
              <div className="glow-card p-4 text-center hover:border-brand-medium transition-all">
                <item.icon className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.label}</p>
              </div>
            )
            return (
              <div key={item.label}>
                {item.href ? <Link href={item.href}>{card}</Link> : card}
              </div>
            )
          })}
        </div>
      </div>

      {/* Unread contacts callout */}
      {stats.unreadContacts > 0 && (
        <Link href="/admin/settings">
          <div className="glow-card p-5 border-brand-500/40 flex items-center justify-between hover:border-brand-500/60 transition-all">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-400" />
              <p className="text-sm text-slate-300">
                You have <span className="text-white font-semibold">{stats.unreadContacts}</span> unread contact submission{stats.unreadContacts > 1 ? 's' : ''}.
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-brand-400" />
          </div>
        </Link>
      )}
    </div>
  )
}
