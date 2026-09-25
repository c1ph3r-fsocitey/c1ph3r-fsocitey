'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ShoppingBag, Package, TrendingUp, AlertCircle,
  ExternalLink, RefreshCw, CheckCircle, XCircle, Clock, Layers
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface TindieStats {
  totalOrders: number
  shippedCount: number
  unshippedCount: number
  refundedCount: number
  totalRevenue: number
  avgOrderValue: number
  unitsSold: number
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
  meta: { totalAllTime: number; filtered: number; from: string | null; to: string | null }
}

// ─── Date presets ─────────────────────────────────────────────────────────────

type PresetKey = 'all' | '7d' | '30d' | '90d' | 'ytd' | 'lastyear' | 'custom'

interface Preset {
  key: PresetKey
  label: string
  getRange: () => { from: string | null; to: string | null }
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

const PRESETS: Preset[] = [
  {
    key: 'all',
    label: 'All Time',
    getRange: () => ({ from: null, to: null }),
  },
  {
    key: '7d',
    label: 'Last 7 Days',
    getRange: () => {
      const to   = new Date()
      const from = new Date(); from.setDate(from.getDate() - 6)
      return { from: isoDate(from), to: isoDate(to) }
    },
  },
  {
    key: '30d',
    label: 'Last 30 Days',
    getRange: () => {
      const to   = new Date()
      const from = new Date(); from.setDate(from.getDate() - 29)
      return { from: isoDate(from), to: isoDate(to) }
    },
  },
  {
    key: '90d',
    label: 'Last 90 Days',
    getRange: () => {
      const to   = new Date()
      const from = new Date(); from.setDate(from.getDate() - 89)
      return { from: isoDate(from), to: isoDate(to) }
    },
  },
  {
    key: 'ytd',
    label: 'This Year',
    getRange: () => {
      const year = new Date().getFullYear()
      return { from: `${year}-01-01`, to: isoDate(new Date()) }
    },
  },
  {
    key: 'lastyear',
    label: 'Last Year',
    getRange: () => {
      const year = new Date().getFullYear() - 1
      return { from: `${year}-01-01`, to: `${year}-12-31` }
    },
  },
  {
    key: 'custom',
    label: 'Custom',
    getRange: () => ({ from: null, to: null }), // filled by custom inputs
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminTindiePage() {
  const [data, setData]             = useState<TindieData | null>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [preset, setPreset]         = useState<PresetKey>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo]     = useState(isoDate(new Date()))

  const load = useCallback(async (from: string | null, to: string | null) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Not authenticated')

      const params = new URLSearchParams()
      if (from) params.set('from', from)
      if (to)   params.set('to',   to)
      const qs = params.toString() ? '?' + params.toString() : ''

      const res = await fetch(`/api/tindie${qs}`, {
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
  }, [])

  // Initial load — all time
  useEffect(() => {
    const { from, to } = PRESETS[0].getRange()
    load(from, to)
  }, [load])

  const applyPreset = (key: PresetKey) => {
    setPreset(key)
    if (key === 'custom') return // wait for manual apply
    const p = PRESETS.find(p => p.key === key)!
    const { from, to } = p.getRange()
    load(from, to)
  }

  const applyCustom = () => {
    load(customFrom || null, customTo || null)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tindie Store</h1>
          <p className="text-slate-500 text-sm mt-1">Fetching live data from Tindie…</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button
            onClick={() => { const p = PRESETS.find(p => p.key === preset)!; const { from, to } = p.getRange(); load(from, to) }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null
  const { stats, topProducts, recentOrders, actionQueue, meta } = data

  // Period label for display
  const activePreset = PRESETS.find(p => p.key === preset)!
  const periodLabel  = preset === 'custom'
    ? `${customFrom || '?'} → ${customTo || '?'}`
    : activePreset.label

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tindie Store</h1>
          <p className="text-slate-500 text-sm mt-1">
            {meta.from
              ? `${meta.filtered} orders · ${periodLabel}`
              : `${meta.totalAllTime} orders · All Time`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { const p = PRESETS.find(p => p.key === preset)!; const { from, to } = p.getRange(); load(from, to) }}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white border border-brand-subtle hover:border-brand-500/40 text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading…' : 'Refresh'}
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

      {/* Date Filter Bar */}
      <div className="glow-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                preset === p.key
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-700 text-slate-400 hover:text-slate-200 border border-brand-subtle hover:border-brand-500/30'
              }`}
            >
              {p.label}
            </button>
          ))}

          {/* Custom date inputs */}
          {preset === 'custom' && (
            <div className="flex items-center gap-2 ml-2 flex-wrap">
              <span className="text-slate-500 text-sm">From</span>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm bg-surface-700 border border-brand-subtle text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <span className="text-slate-500 text-sm">to</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm bg-surface-700 border border-brand-subtle text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <button
                onClick={applyCustom}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-sm bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Orders',          value: stats.totalOrders,            icon: <ShoppingBag className="w-4 h-4" />, color: 'text-brand-400' },
          { label: 'Revenue',         value: fmt(stats.totalRevenue),      icon: <TrendingUp className="w-4 h-4" />,  color: 'text-green-400' },
          { label: 'Avg Order',       value: fmt(stats.avgOrderValue),     icon: <TrendingUp className="w-4 h-4" />,  color: 'text-cyan-400'  },
          { label: 'Units Sold',      value: stats.unitsSold,              icon: <Layers className="w-4 h-4" />,      color: 'text-purple-400' },
          { label: 'Shipped',         value: stats.shippedCount,           icon: <Package className="w-4 h-4" />,     color: 'text-slate-400' },
          { label: 'Needs Shipping',  value: stats.unshippedCount,         icon: <Clock className="w-4 h-4" />,       color: stats.unshippedCount > 0 ? 'text-amber-400' : 'text-slate-500' },
          { label: 'Refunded',        value: stats.refundedCount,          icon: <XCircle className="w-4 h-4" />,     color: 'text-red-400'   },
        ].map(card => (
          <div key={card.label} className={`glow-card p-4 ${loading ? 'opacity-60' : ''} transition-opacity`}>
            <div className={`flex items-center gap-1.5 mb-1.5 ${card.color}`}>
              {card.icon}
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
            </div>
            <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Period note when filtered */}
      {meta.from && (
        <p className="text-xs text-slate-600 -mt-4">
          Stats above are for <span className="text-slate-400">{periodLabel}</span>.
          "Needs Shipping" always shows all unshipped orders regardless of period.
          {meta.totalAllTime !== meta.filtered && (
            <> {meta.totalAllTime} total orders of all time.</>
          )}
        </p>
      )}

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
          <h2 className="font-bold text-white mb-4">
            Orders
            {meta.from ? ` · ${periodLabel}` : ''}
          </h2>
          <div className={`glow-card overflow-hidden ${loading ? 'opacity-60' : ''} transition-opacity`}>
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
              <div className="py-12 text-center text-slate-500 text-sm">
                No orders in this period.
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="xl:col-span-2">
          <h2 className="font-bold text-white mb-4">
            Top Products
            {meta.from ? ` · ${periodLabel}` : ''}
          </h2>
          <div className={`glow-card p-5 space-y-4 ${loading ? 'opacity-60' : ''} transition-opacity`}>
            {topProducts.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-6">No sales in this period.</p>
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
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
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
