'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/context/cartStore'
import { formatPrice } from '@/lib/utils/format'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, coupon, removeCoupon, getSubtotal, getDiscount, getTotal } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [applying, setApplying] = useState(false)

  const subtotal  = getSubtotal()
  const discount  = getDiscount()
  const total     = getTotal()

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplying(true)
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}`)
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      useCartStore.getState().applyCoupon(data.coupon)
      toast.success('Coupon applied!')
      setCouponCode('')
    } catch {
      toast.error('Failed to apply coupon')
    } finally {
      setApplying(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="section-container section-padding text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-2xl bg-surface-800 border border-brand-subtle flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">Add some hardware to get started.</p>
          <Link href="/store"><Button size="lg">Browse Products</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-grid">
      <div className="section-container py-12">
        <h1 className="text-3xl font-bold text-white mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="glow-card p-5">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl bg-surface-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-lg font-mono font-bold text-brand-400/30">{product.name.slice(0,2)}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/store/${product.slug}`}>
                      <h3 className="font-bold text-white hover:text-brand-400 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-brand-400">{product.tagline}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{formatPrice(product.price)} each</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => removeItem(product.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold text-white">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-7 h-7 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-white">{formatPrice(product.price * quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="glow-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

              {/* Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-900/20 border border-green-700/30 mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">{coupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-slate-500 hover:text-red-400">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="secondary" isLoading={applying} onClick={handleApplyCoupon}>Apply</Button>
                </div>
              )}

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-brand-subtle">
                  <span className="text-white">Total</span>
                  <span className="text-white text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/store/checkout">
                <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-slate-600 text-center mt-4">
                Secure checkout · PayPal & Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
