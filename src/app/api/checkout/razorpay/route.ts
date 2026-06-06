import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServiceClient } from '@/lib/supabase/server'
import { usdToInr } from '@/lib/utils/format'

function getRazorpay() {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured')
  }
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { items, form, coupon, total } = await req.json()

    if (!items?.length || !form || !total) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find or create customer
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', form.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({ email: form.email, full_name: form.full_name, phone: form.phone })
        .select('id')
        .single()
      customerId = newCustomer?.id ?? null
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0)
    const discount = coupon
      ? coupon.type === 'percentage'
        ? (subtotal * coupon.value) / 100
        : Math.min(coupon.value, subtotal)
      : 0
    const finalTotal = Math.max(0, subtotal - discount)
    const amountInr = usdToInr(finalTotal)

    // Create Razorpay order
    const razorpay = getRazorpay()
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInr * 100,  // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    // Create order in DB (payment_status: pending until webhook confirms)
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id:      customerId,
        customer_email:   form.email,
        customer_name:    form.full_name,
        subtotal,
        discount,
        shipping:         0,
        tax:              0,
        total:            finalTotal,
        currency:         'INR',
        status:           'payment_pending',
        payment_status:   'pending',
        payment_provider: 'razorpay',
        payment_id:       razorpayOrder.id,
        coupon_code:      coupon?.code,
        shipping_address: {
          full_name:   form.full_name,
          line1:       form.line1,
          line2:       form.line2,
          city:        form.city,
          state:       form.state,
          postal_code: form.postal_code,
          country:     form.country,
          phone:       form.phone,
        },
      })
      .select('id')
      .single()

    if (error || !order) {
      console.error('DB error:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      items.map((i: any) => ({
        order_id:    order.id,
        product_id:  i.product.id,
        quantity:    i.quantity,
        unit_price:  i.product.price,
        total_price: i.product.price * i.quantity,
      }))
    )

    return NextResponse.json({
      amount: amountInr * 100,
      currency: 'INR',
      razorpay_order_id: razorpayOrder.id,
      order_id: order.id,
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
