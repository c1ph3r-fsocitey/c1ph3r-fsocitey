import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken(): Promise<string> {
  const resp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  const data = await resp.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { items, form, coupon, total } = await req.json()

    if (!items?.length || !form || !total) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const token = await getPayPalToken()

    const subtotal = items.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0)
    const discount = coupon
      ? coupon.type === 'percentage'
        ? (subtotal * coupon.value) / 100
        : Math.min(coupon.value, subtotal)
      : 0
    const finalTotal = Math.max(0, subtotal - discount)

    // Create PayPal order
    const ppResp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: finalTotal.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
              discount: { currency_code: 'USD', value: discount.toFixed(2) },
            },
          },
          items: items.map((i: any) => ({
            name:       i.product.name,
            quantity:   String(i.quantity),
            unit_amount: { currency_code: 'USD', value: i.product.price.toFixed(2) },
          })),
          shipping: {
            name: { full_name: form.full_name },
            address: {
              address_line_1: form.line1,
              address_line_2: form.line2,
              admin_area_2: form.city,
              admin_area_1: form.state,
              postal_code:  form.postal_code,
              country_code: 'IN',
            },
          },
        }],
        application_context: {
          brand_name:          'C1ph3r Fsociety',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action:         'PAY_NOW',
        },
      }),
    })

    const ppOrder = await ppResp.json()
    if (!ppOrder.id) {
      console.error('PayPal error:', ppOrder)
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
    }

    // Save pending order
    const { data: order } = await supabase
      .from('orders')
      .insert({
        customer_email:   form.email,
        customer_name:    form.full_name,
        subtotal, discount, shipping: 0, tax: 0, total: finalTotal,
        currency:         'USD',
        status:           'payment_pending',
        payment_status:   'pending',
        payment_provider: 'paypal',
        payment_id:       ppOrder.id,
        coupon_code:      coupon?.code,
        shipping_address: { full_name: form.full_name, line1: form.line1, line2: form.line2, city: form.city, state: form.state, postal_code: form.postal_code, country: form.country, phone: form.phone },
      })
      .select('id')
      .single()

    if (order) {
      await supabase.from('order_items').insert(
        items.map((i: any) => ({ order_id: order.id, product_id: i.product.id, quantity: i.quantity, unit_price: i.product.price, total_price: i.product.price * i.quantity }))
      )
    }

    return NextResponse.json({ paypal_order_id: ppOrder.id, order_id: order?.id })
  } catch (err) {
    console.error('PayPal checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
