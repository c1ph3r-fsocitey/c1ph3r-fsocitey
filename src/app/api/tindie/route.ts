import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Tindie Orders API proxy
// Keeps TINDIE_API_KEY and TINDIE_USERNAME server-side only.
// Verifies the caller is a logged-in admin via Bearer token.
// GET /api/tindie?limit=200
// ---------------------------------------------------------------------------

const TINDIE_BASE = 'https://www.tindie.com/api/v1/order/'

interface TindieOrderItem {
  product: string
  model_number: string
  sku: string
  options: string
  quantity: number
  price_unit: string
  price_total: string
}

interface TindieOrderRaw {
  number: string
  date: string
  date_shipped: string
  shipped: boolean
  refunded: boolean
  email: string
  phone: string
  shipping_name: string
  shipping_city: string
  shipping_state: string
  shipping_country: string
  shipping_postcode: string
  shipping_service: string
  tracking_code: string
  tracking_url: string
  total_subtotal: string
  total_shipping: string
  total_tindiefee: string
  total_ccfee: string
  total_seller: string
  items: TindieOrderItem[]
}

interface TindieResponse {
  orders: TindieOrderRaw[]
  meta: {
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total_count: number
  }
}

async function fetchAllOrders(username: string, apiKey: string): Promise<TindieOrderRaw[]> {
  const allOrders: TindieOrderRaw[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const url = `${TINDIE_BASE}?format=json&username=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&limit=${limit}&offset=${offset}`
    const res = await fetch(url, { next: { revalidate: 300 } }) // cache 5 min

    if (!res.ok) {
      throw new Error(`Tindie API error: ${res.status} ${res.statusText}`)
    }

    const data: TindieResponse = await res.json()
    allOrders.push(...data.orders)

    if (!data.meta.next || allOrders.length >= data.meta.total_count) break
    offset += limit
  }

  return allOrders
}

export async function GET(req: NextRequest) {
  // Auth: verify Bearer token
  const token = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()
  const { data: { user } } = await service.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check env vars
  const username = process.env.TINDIE_USERNAME
  const apiKey   = process.env.TINDIE_API_KEY
  if (!username || !apiKey) {
    return NextResponse.json(
      { error: 'TINDIE_USERNAME and TINDIE_API_KEY are not configured in environment variables.' },
      { status: 503 }
    )
  }

  try {
    const orders = await fetchAllOrders(username, apiKey)

    // Compute derived analytics server-side
    const totalOrders    = orders.length
    const unshipped      = orders.filter(o => !o.shipped && !o.refunded)
    const refunded       = orders.filter(o => o.refunded)
    const shipped        = orders.filter(o => o.shipped && !o.refunded)
    const totalRevenue   = orders
      .filter(o => !o.refunded)
      .reduce((sum, o) => sum + parseFloat(o.total_seller || '0'), 0)
    const avgOrderValue  = totalOrders > 0 ? totalRevenue / (totalOrders - refunded.length) : 0

    // Top products by units sold
    const productMap: Record<string, { name: string; sku: string; units: number; revenue: number }> = {}
    for (const order of orders) {
      if (order.refunded) continue
      for (const item of order.items) {
        const key = item.sku || item.product
        if (!productMap[key]) {
          productMap[key] = { name: item.product, sku: item.sku, units: 0, revenue: 0 }
        }
        productMap[key].units   += item.quantity
        productMap[key].revenue += parseFloat(item.price_total || '0')
      }
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 10)

    // Recent 20 orders for the table
    const recentOrders = orders.slice(0, 20).map(o => ({
      number:       o.number,
      date:         o.date,
      shipped:      o.shipped,
      refunded:     o.refunded,
      customer:     o.shipping_name,
      country:      o.shipping_country,
      items:        o.items.map(i => `${i.quantity}× ${i.product}`).join(', '),
      total_seller: parseFloat(o.total_seller || '0'),
      tracking_url: o.tracking_url || null,
    }))

    // Unshipped action queue (full detail)
    const actionQueue = unshipped.map(o => ({
      number:       o.number,
      date:         o.date,
      customer:     o.shipping_name,
      email:        o.email,
      address:      [o.shipping_name, o.shipping_city, o.shipping_state, o.shipping_postcode, o.shipping_country].filter(Boolean).join(', '),
      items:        o.items.map(i => `${i.quantity}× ${i.product}`).join(', '),
      total_seller: parseFloat(o.total_seller || '0'),
    }))

    return NextResponse.json({
      stats: {
        totalOrders,
        shippedCount:   shipped.length,
        unshippedCount: unshipped.length,
        refundedCount:  refunded.length,
        totalRevenue:   Math.round(totalRevenue * 100) / 100,
        avgOrderValue:  Math.round(avgOrderValue * 100) / 100,
      },
      topProducts,
      recentOrders,
      actionQueue,
    })
  } catch (err: any) {
    console.error('Tindie API fetch error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch Tindie data' }, { status: 500 })
  }
}
