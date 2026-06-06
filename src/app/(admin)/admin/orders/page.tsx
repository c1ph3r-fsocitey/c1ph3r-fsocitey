import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Orders — Admin' }

export default async function AdminOrdersPage() {
  const supabase = createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(count)')
    .order('created_at', { ascending: false })
    .limit(50)

  const STATUS_BADGE: Record<string, 'cyan' | 'warning' | 'info' | 'success' | 'error'> = {
    pending:         'warning',
    payment_pending: 'warning',
    confirmed:       'cyan',
    processing:      'info',
    shipped:         'info',
    delivered:       'success',
    cancelled:       'error',
    refunded:        'error',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-500 text-sm">{orders?.length ?? 0} recent orders</p>
        </div>
      </div>

      <div className="glow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-subtle">
              <tr className="text-left text-xs text-slate-500">
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-subtle">
              {orders?.map(order => (
                <tr key={order.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-brand-400 font-medium">{order.order_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-slate-500 text-xs">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{(order.order_items as any)?.[0]?.count ?? '?'}</td>
                  <td className="px-6 py-4 text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'error' : 'warning'}>
                      {order.payment_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_BADGE[order.status] || 'info'}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(order.created_at, 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`}
                      className="text-brand-400 hover:text-brand-300 text-xs font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
