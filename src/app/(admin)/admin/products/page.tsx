'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Eye, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading products...</div>
      ) : (
        <div className="glow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-subtle">
              <tr className="text-left text-xs text-slate-500">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-subtle">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-slate-500 text-xs font-mono">{product.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="cyan">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock <= 3 ? 'text-amber-400' : 'text-slate-300'}>
                      {product.stock} left
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="error">Inactive</Badge>}
                      {product.is_featured && <Badge variant="purple">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/store/${product.slug}`} target="_blank">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
