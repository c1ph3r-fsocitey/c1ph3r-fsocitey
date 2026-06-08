'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Mail, Package } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      setCustomers(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-500 text-sm">{customers.length} total customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-800 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading customers...</div>
      ) : filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <p className="text-slate-500">
            {search ? 'No customers match your search.' : 'No customers yet — they appear here after their first order.'}
          </p>
        </div>
      ) : (
        <div className="glow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-subtle">
              <tr className="text-left text-xs text-slate-500">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-subtle">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{customer.full_name}</p>
                      <p className="text-slate-500 text-xs">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Package className="w-3.5 h-3.5" />
                      {customer.orders_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {formatPrice(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {customer.last_order_at ? formatDate(customer.last_order_at, 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(customer.created_at, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${customer.email}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors inline-flex">
                      <Mail className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
