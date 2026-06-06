import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/email/orderConfirmation'

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
    const { paypal_order_id } = await req.json()
    const token = await getPayPalToken()

    // Capture PayPal payment
    const captureResp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    const capture = await captureResp.json()

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'confirmed', payment_status: 'paid' })
      .eq('payment_id', paypal_order_id)
      .select('*, order_items(*, products(*))')
      .single()

    if (!order) return NextResponse.json({ success: false }, { status: 404 })

    // Decrement stock
    for (const item of order.order_items ?? []) {
      await supabase.rpc('decrement_stock', { product_id: item.product_id, quantity: item.quantity })
    }

    await sendOrderConfirmationEmail(order)

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (err) {
    console.error('Capture error:', err)
    return NextResponse.json({ success: false, error: 'Capture failed' }, { status: 500 })
  }
}
