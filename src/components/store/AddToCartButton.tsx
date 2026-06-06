'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/context/cartStore'
import type { Product } from '@/types'
import { cn } from '@/lib/utils/cn'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
  showLabel?: boolean
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  showLabel = false,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock <= 0) return

    addItem(product, quantity)
    setAdded(true)
    toast.success(`${product.name} added to cart`)

    setTimeout(() => setAdded(false), 2000)
  }

  const outOfStock = product.stock <= 0

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock || added}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
        outOfStock
          ? 'bg-surface-700 text-slate-500 cursor-not-allowed'
          : added
          ? 'bg-green-600 text-white'
          : 'bg-brand-500 text-white hover:bg-brand-400 shadow-glow',
        className
      )}
      aria-label={outOfStock ? 'Out of stock' : 'Add to cart'}
    >
      {added ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {showLabel && (
        <span>{outOfStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}</span>
      )}
    </button>
  )
}
