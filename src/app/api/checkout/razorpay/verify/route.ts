import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/email/orderConfirmation'

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Update order
    const { data: order } = await supabase
      .from('orders')
      .update({
        status:           'confirmed',
        payment_status:   'paid',
        payment_id:       razorpay_payment_id,
        updated_at:       new Date().toISOString(),
      })
      .eq('id', order_id)
      .select('*, order_items(*, products(*))')
      .single()

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Update inventory
    for (const item of order.order_items ?? []) {
      await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity:   item.quantity,
      })
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(order)

    return NextResponse.json({ success: true, order_id })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
