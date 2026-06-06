'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartStore } from '@/context/cartStore'
import { formatPrice } from '@/lib/utils/format'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import { AlertTriangle, ShieldCheck, CreditCard } from 'lucide-react'

interface CheckoutForm {
  full_name: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  postal_code: string
  country: string
}

type PaymentMethod = 'paypal' | 'razorpay'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDiscount, getTotal, coupon, clearCart } = useCartStore()
  const [form, setForm] = useState<CheckoutForm>({
    full_name: '', email: '', phone: '', line1: '', line2: '',
    city: '', state: '', postal_code: '', country: 'India',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total    = getTotal()

  const validate = () => {
    const e: Partial<CheckoutForm> = {}
    if (!form.full_name.trim()) e.full_name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.line1.trim()) e.line1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Razorpay checkout
  const handleRazorpay = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      // Create order on server
      const res = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, form, coupon, total }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'C1ph3r Fsociety',
          description: 'Security Hardware Order',
          order_id: data.razorpay_order_id,
          prefill: { name: form.full_name, email: form.email, contact: form.phone },
          theme: { color: '#1aa9bd' },
          handler: async (response: any) => {
            // Verify on server
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, order_id: data.order_id }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              clearCart()
              router.push(`/store/order-confirmed?id=${verifyData.order_id}`)
            } else {
              toast.error('Payment verification failed')
            }
          },
        })
        rzp.open()
      }
    } catch {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const createPayPalOrder = async () => {
    if (!validate()) throw new Error('Please fill in all required fields')
    const res = await fetch('/api/checkout/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, form, coupon, total }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.paypal_order_id
  }

  const onPayPalApprove = async (data: any) => {
    try {
      const res = await fetch('/api/checkout/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypal_order_id: data.orderID }),
      })
      const result = await res.json()
      if (result.success) {
        clearCart()
        router.push(`/store/order-confirmed?id=${result.order_id}`)
      } else {
        toast.error('Payment capture failed')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const update = (field: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  if (items.length === 0) {
    return (
      <div className="section-container section-padding text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
        <a href="/store" className="text-brand-400 hover:text-brand-300">← Return to store</a>
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <div className="bg-grid">
        <div className="section-container py-12">
          <h1 className="text-3xl font-bold text-white mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="glow-card p-6">
                <h2 className="text-lg font-bold text-white mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" required value={form.full_name} onChange={update('full_name')} error={errors.full_name} />
                  <Input label="Email" type="email" required value={form.email} onChange={update('email')} error={errors.email} />
                  <Input label="Phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 XXXXXXXXXX" />
                </div>
              </div>

              {/* Shipping */}
              <div className="glow-card p-6">
                <h2 className="text-lg font-bold text-white mb-5">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Address Line 1" required value={form.line1} onChange={update('line1')} error={errors.line1} />
                  <Input label="Address Line 2" value={form.line2} onChange={update('line2')} placeholder="Apartment, suite, etc." />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" required value={form.city} onChange={update('city')} error={errors.city} />
                    <Input label="State / Province" value={form.state} onChange={update('state')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Postal Code" value={form.postal_code} onChange={update('postal_code')} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-300">Country <span className="text-brand-400">*</span></label>
                      <select
                        value={form.country}
                        onChange={update('country')}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
                      >
                        <option>India</option>
                        <option>United States of America</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Australia</option>
                        <option>Canada</option>
                        <option>Singapore</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="glow-card p-6">
                <h2 className="text-lg font-bold text-white mb-5">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Wallets (INR)', badge: 'India' },
                    { id: 'paypal',   label: 'PayPal',   sub: 'International (USD)', badge: 'Global' },
                  ].map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === pm.id
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-brand-subtle bg-surface-700 hover:border-brand-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{pm.label}</span>
                        <Badge variant={pm.id === 'razorpay' ? 'cyan' : 'info'}>{pm.badge}</Badge>
                      </div>
                      <span className="text-xs text-slate-500">{pm.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Legal */}
                <div className="flex gap-3 p-4 rounded-xl bg-amber-900/15 border border-amber-700/30 mb-5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400/80">
                    By placing this order you confirm you are 18+ and will use these products
                    only for authorized security research, ethical hacking, and educational purposes.
                    You are solely responsible for compliance with local laws.
                  </p>
                </div>

                {paymentMethod === 'razorpay' && (
                  <Button size="lg" className="w-full" isLoading={loading} onClick={handleRazorpay}
                    leftIcon={<CreditCard className="w-5 h-5" />}>
                    Pay with Razorpay ({formatPrice(total * 84, 'INR')} approx)
                  </Button>
                )}

                {paymentMethod === 'paypal' && (
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={() => toast.error('PayPal error. Please try again.')}
                  />
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="glow-card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-slate-400">{product.name} × {quantity}</span>
                      <span className="text-slate-200">{formatPrice(product.price * quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-3 border-t border-brand-subtle">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount ({coupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-brand-subtle">
                    <span className="text-white">Total</span>
                    <span className="text-xl text-white">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  Secured by PayPal / Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
