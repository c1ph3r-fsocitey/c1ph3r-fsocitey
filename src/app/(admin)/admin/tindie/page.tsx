'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ShoppingBag, Package, TrendingUp, AlertCircle,
  ExternalLink, RefreshCw, CheckCircle, XCircle, Clock
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface TindieStats {
  totalOrders: number
  shippedCount: number
  unshippedCount: number
  refundedCount: number
  totalRevenue: number
  avgOrderValue: number
}

interface TopProduct {
  name: string
  sku: string
  units: number
  revenue: number
}

interface RecentOrder {
  number: string
  date: string
  shipped: boolean
  refunded: boolean
  customer: string
  country: string
  items: string
  total_seller: number
  tracking_url: string | null
}

interface ActionItem {
  number: string
  date: string
  customer: string
  email: string
  address: string
  items: string
  total_seller: number
}

interface TindieData {
  stats: TindieStats
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
  actionQueue: ActionItem[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminTindiePage() {
  const [data, setData]       = useState<TindieData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Not authenticated')

      const res = await fetch('/api/tindie', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to fetch')
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tindie Store</h1>
            <p className="text-slate-500 text-sm mt-1">Fetching live data from Tindie…</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glow-card p-5 animate-pulse">
              <div className="h-4 bg-surface-600 rounded w-2/3 mb-3" />
              <div className="h-7 bg-surface-600 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Tindie Store</h1>
        <div className="glow-card p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Could not load Tindie data</p>
          <p className="text-slate-500 text-sm mb-2">{error}</p>
          {error.includes('not configured') && (
            <p className="text-slate-600 text-xs max-w-md mx-auto mb-5">
              Add <code className="bg-surface-700 px-1 rounded">TINDIE_USERNAME</code> and{' '}
              <code className="bg-surface-700 px-1 rounded">TINDIE_API_KEY</code> to your Vercel
              environment variables, then redeploy.
            </p>
          )}
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null
  const { stats, topProducts, recentOrders, actionQueue } = data

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tindie Store</h1>
          <p className="text-slate-500 text-sm mt-1">Live data from your Tindie seller account</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white border border-brand-subtle hover:border-brand-500/40 text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <a
            href="https://www.tindie.com/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open Tindie
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Orders',    value: stats.totalOrders,            icon: <ShoppingBag className="w-4 h-4" />,  color: 'text-brand-400' },
          { label: 'Revenue',         value: fmt(stats.totalRevenue),      icon: <TrendingUp className="w-4 h-4" />,   color: 'text-green-400' },
          { label: 'Avg Order',       value: fmt(stats.avgOrderValue),     icon: <TrendingUp className="w-4 h-4" />,   color: 'text-cyan-400'  },
          { label: 'Shipped',         value: stats.shippedCount,           icon: <Package className="w-4 h-4" />,      color: 'text-slate-400' },
          { label: 'Needs Shipping',  value: stats.unshippedCount,         icon: <Clock className="w-4 h-4" />,        color: stats.unshippedCount > 0 ? 'text-amber-400' : 'text-slate-500' },
          { label: 'Refunded',        value: stats.refundedCount,          icon: <XCircle className="w-4 h-4" />,      color: 'text-red-400'   },
        ].map(card => (
          <div key={card.label} className="glow-card p-5">
            <div className={`flex items-center gap-1.5 mb-2 ${card.color}`}>
              {card.icon}
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Action Queue — unshipped orders */}
      {actionQueue.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="font-bold text-white">Needs Shipping ({actionQueue.length})</h2>
          </div>
          <div className="space-y-3">
            {actionQueue.map(order => (
              <div key={order.number} className="glow-card p-5 border-amber-700/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-brand-400 text-sm font-bold">#{order.number}</span>
                      <span className="text-xs text-slate-500">{fmtDate(order.date)}</span>
                      <span className="text-green-400 text-sm font-semibold">{fmt(order.total_seller)}</span>
                    </div>
                    <p className="text-white text-sm font-medium">{order.customer}</p>
                    <p className="text-slate-500 text-xs">{order.address}</p>
                    <p className="text-slate-400 text-sm mt-1">{order.items}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`mailto:${order.email}`}
                      className="px-3 py-1.5 rounded-lg text-xs bg-surface-700 border border-brand-subtle text-slate-300 hover:text-white transition-colors"
                    >
                      Email buyer
                    </a>
                    <a
                      href={`https://www.tindie.com/orders/seller/?order_number=${order.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs bg-brand-500/20 border border-brand-500/30 text-brand-400 hover:bg-brand-500/30 transition-colors"
                    >
                      Mark shipped ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-column: Recent orders + Top products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Recent orders */}
        <div className="xl:col-span-3">
          <h2 className="font-bold text-white mb-4">Recent Orders</h2>
          <div className="glow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-subtle">
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium">Order</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium hidden md:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium hidden lg:table-cell">Items</th>
                  <th className="text-right px-4 py-3 text-xs text-slate-500 font-medium">Payout</th>
                  <th className="text-center px-4 py-3 text-xs text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-subtle">
                {recentOrders.map(order => (
                  <tr key={order.number} className="hover:bg-surface-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={`https://www.tindie.com/orders/seller/?order_number=${order.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-brand-400 hover:text-brand-300 text-xs"
                      >
                        #{order.number}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {fmtDate(order.date)}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs hidden md:table-cell">
                      <div>{order.customer}</div>
                      <div className="text-slate-600">{order.country}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell max-w-[200px] truncate">
                      {order.items}
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium text-xs whitespace-nowrap">
                      {fmt(order.total_seller)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {order.refunded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-red-900/30 border border-red-700/30 text-red-400">
                          <XCircle className="w-3 h-3" /> Refunded
                        </span>
                      ) : order.shipped ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-900/30 border border-green-700/30 text-green-400">
                          <CheckCircle className="w-3 h-3" /> Shipped
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-900/30 border border-amber-700/30 text-amber-400">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">No orders yet.</div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="xl:col-span-2">
          <h2 className="font-bold text-white mb-4">Top Products</h2>
          <div className="glow-card p-5 space-y-4">
            {topProducts.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-6">No sales data yet.</p>
            )}
            {topProducts.map((product, i) => {
              const maxUnits = topProducts[0]?.units || 1
              const pct = Math.round((product.units / maxUnits) * 100)
              return (
                <div key={product.sku || i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-slate-600 w-4 flex-shrink-0">#{i + 1}</span>
                      <span className="text-sm text-slate-300 truncate">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-xs text-slate-500">{product.units} units</span>
                      <span className="text-xs text-green-400 font-medium">{fmt(product.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick links */}
          <div className="glow-card p-4 mt-4 space-y-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Quick Links</p>
            {[
              { label: 'Tindie Dashboard',  href: 'https://www.tindie.com/dashboard/' },
              { label: 'All Orders',        href: 'https://www.tindie.com/orders/seller/' },
              { label: 'Unshipped Orders',  href: 'https://www.tindie.com/orders/seller/?shipped=false' },
              { label: 'Your Listings',     href: 'https://www.tindie.com/stores/c1ph3r_fsocitey/' },
              { label: 'Payouts',           href: 'https://www.tindie.com/orders/disbursement/' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-700 transition-colors group"
              >
                <span className="text-sm text-slate-400 group-hover:text-slate-200">{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
