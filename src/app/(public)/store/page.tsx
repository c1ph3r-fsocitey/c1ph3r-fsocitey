import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import BuyOnTindieButton from '@/components/store/BuyOnTindieButton'
import { formatPrice } from '@/lib/utils/format'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

const TINDIE_STORE = 'https://www.tindie.com/stores/c1ph3r_fsocitey/'

export const metadata: Metadata = {
  title: 'Hardware Store',
  description: 'Shop cybersecurity research hardware: BLE jammers, WiFi deauthers, RF tools, and more. Built by C1ph3r Fsociety, shipped from Delhi, India.',
}

const CATEGORIES = [
  { value: 'all',         label: 'All' },
  { value: 'ble-tools',   label: 'BLE Tools' },
  { value: 'wifi-tools',  label: 'WiFi Tools' },
  { value: 'rf-tools',    label: 'RF Tools' },
  { value: 'multi-tools', label: 'Multi-Tools' },
  { value: 'educational', label: 'Educational' },
]

const CATEGORY_BADGE: Record<string, 'cyan' | 'info' | 'purple' | 'success' | 'warning'> = {
  'ble-tools':   'cyan',
  'wifi-tools':  'info',
  'rf-tools':    'purple',
  'multi-tools': 'success',
  'educational': 'warning',
}

export default async function StorePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const allProducts: Product[] = products ?? []

  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">Hardware Store</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tools Built for{' '}
            <span className="gradient-text">Security Professionals</span>
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            All hardware is designed, assembled, and shipped from Delhi, India.
            Open-source firmware. Sold worldwide via Tindie.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={TINDIE_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors shadow-glow"
            >
              <ExternalLink className="w-4 h-4" />
              Browse All on Tindie
            </a>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-sm text-amber-400/80">
            ⚠️ For authorized ethical hacking &amp; security research only. Buyers must be 18+.
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding">
        <div className="section-container">
          {/* Category filter row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <span
                  key={cat.value}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    cat.value === 'all'
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-surface-800 text-slate-400 border-brand-subtle'
                  }`}
                >
                  {cat.label}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500">{allProducts.length} products</p>
          </div>

          {allProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No products listed yet.{' '}
              <a href={TINDIE_STORE} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                Check the Tindie store
              </a>{' '}
              for the latest.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map(product => (
                <div key={product.id} className="glow-card group flex flex-col">
                  {/* Image — links to detail page (showcase) */}
                  <Link href={`/store/${product.slug}`} className="block overflow-hidden bg-surface-700 aspect-[4/3] relative">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl opacity-20 font-mono font-bold text-brand-400">
                          {product.name.slice(0, 3).toUpperCase()}
                        </div>
                      </div>
                    )}
                    {product.stock <= 3 && product.stock > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="warning">Only {product.stock} left</Badge>
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-900/70">
                        <Badge variant="error">Out of Stock</Badge>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge variant={CATEGORY_BADGE[product.category] || 'cyan'}>
                        {product.category.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </Badge>
                      {product.is_featured && <Badge variant="purple">Featured</Badge>}
                    </div>

                    <Link href={`/store/${product.slug}`}>
                      <h3 className="font-bold text-white text-lg mb-1 hover:text-brand-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-brand-400 font-medium mb-2">{product.tagline}</p>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <span className="text-sm text-slate-500 line-through ml-2">{formatPrice(product.compare_at_price)}</span>
                        )}
                        <span className="text-xs text-slate-500 ml-1">free ship</span>
                      </div>
                      <BuyOnTindieButton tindieUrl={product.tindie_url} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          {allProducts.length > 0 && (
            <div className="text-center mt-14">
              <p className="text-slate-500 text-sm mb-4">All purchases are handled securely through Tindie.</p>
              <a
                href={TINDIE_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-700 border border-brand-subtle text-slate-300 font-medium hover:text-white hover:border-brand-500/50 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                View Full Store on Tindie
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
