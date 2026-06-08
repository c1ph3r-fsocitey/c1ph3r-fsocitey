import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, Package, Truck, ChevronLeft, AlertTriangle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatPrice } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

const CATEGORY_BADGE: Record<string, 'cyan' | 'info' | 'purple' | 'success' | 'warning'> = {
  'ble-tools':   'cyan',
  'wifi-tools':  'info',
  'rf-tools':    'purple',
  'multi-tools': 'success',
  'educational': 'warning',
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, tagline, description')
    .eq('slug', params.slug)
    .single()

  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const p = product as Product

  return (
    <div className="bg-grid">
      <div className="section-container py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/store" className="hover:text-brand-400 transition-colors">Store</Link>
          <span>/</span>
          <span className="text-slate-300">{p.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-surface-800 border border-brand-subtle aspect-square flex items-center justify-center">
              {p.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="text-8xl font-mono font-bold text-brand-400/20">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Thumbnail strip if multiple images */}
            {p.images && p.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {p.images.slice(0, 5).map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt="" className="w-16 h-16 object-contain rounded-lg border border-brand-subtle bg-surface-800 p-1" />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={CATEGORY_BADGE[p.category] || 'cyan'}>
                {p.category.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Badge>
              {p.stock <= 3 && p.stock > 0 && <Badge variant="warning">Only {p.stock} left</Badge>}
              {p.stock === 0 && <Badge variant="error">Out of Stock</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{p.name}</h1>
            <p className="text-brand-400 text-lg font-medium mb-4">{p.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-white">{formatPrice(p.price)}</span>
              {p.compare_at_price && p.compare_at_price > p.price && (
                <span className="text-xl text-slate-500 line-through">{formatPrice(p.compare_at_price)}</span>
              )}
              <span className="text-sm text-green-400">+ Free Worldwide Shipping</span>
            </div>

            {/* Tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {p.tags.map((tag: string) => (
                  <span key={tag} className="tech-badge">{tag}</span>
                ))}
              </div>
            )}

            <p className="text-slate-400 leading-relaxed mb-8">{p.description}</p>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <AddToCartButton product={p} showLabel className="flex-1 py-3.5 text-base" />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Truck className="w-5 h-5" />, label: 'Free Shipping', sub: 'Worldwide' },
                { icon: <Shield className="w-5 h-5" />, label: 'Secure Payment', sub: 'PayPal & Razorpay' },
                { icon: <Package className="w-5 h-5" />, label: 'Ships from India', sub: 'Delhi, IN' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-800 border border-brand-subtle text-center">
                  <span className="text-brand-400">{item.icon}</span>
                  <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                  <span className="text-xs text-slate-600">{item.sub}</span>
                </div>
              ))}
            </div>

            {/* Legal disclaimer */}
            {p.legal_disclaimer && (
              <div className="flex gap-3 p-4 rounded-xl bg-amber-900/15 border border-amber-700/30">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400/80">{p.legal_disclaimer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features & Specs */}
        {((p.features && p.features.length > 0) || (p.specs && Object.keys(p.specs).length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {p.features && p.features.length > 0 && (
              <div className="glow-card p-7">
                <h2 className="text-xl font-bold text-white mb-5">Key Features</h2>
                <ul className="space-y-3">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      </div>
                      <span className="text-sm text-slate-400">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {p.specs && Object.keys(p.specs).length > 0 && (
              <div className="glow-card p-7">
                <h2 className="text-xl font-bold text-white mb-5">Technical Specifications</h2>
                <dl className="space-y-3">
                  {Object.entries(p.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-brand-subtle last:border-0">
                      <dt className="text-sm text-slate-500 font-medium">{key}</dt>
                      <dd className="text-sm text-slate-300 text-right">{value as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
