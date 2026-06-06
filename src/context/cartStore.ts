import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, Coupon } from '@/types'

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] }
        })
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      },

      getDiscount: () => {
        const { coupon, getSubtotal } = get()
        if (!coupon) return 0
        const subtotal = getSubtotal()
        if (coupon.type === 'percentage') return (subtotal * coupon.value) / 100
        return Math.min(coupon.value, subtotal)
      },

      getTotal: () => {
        const { getSubtotal, getDiscount } = get()
        return Math.max(0, getSubtotal() - getDiscount())
      },
    }),
    {
      name: 'c1ph3r-cart',
    }
  )
)
