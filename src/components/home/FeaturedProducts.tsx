import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AddToCartButton from '@/components/store/AddToCartButton'
import type { Product } from '@/types'

const CATEGORY_COLORS: Record<string, 'cyan' | 'purple' | 'info' | 'success'> = {
  'ble-tools':   'cyan',
  'wifi-tools':  'info',
  'rf-tools':    'purple',
  'multi-tools': 'success',
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="section-padding bg-grid">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="section-eyebrow mb-3">Hardware Store</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tools Built for the{' '}
              <span className="gradient-text">Field</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl text-balance">
              Every device is designed, assembled, and tested in-house. Open-source firmware,
              ESP32-based, ready for authorized security research.
            </p>
          </div>
          <Link href="/store">
            <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="glow-card group flex flex-col">
              <Link href={`/store/${product.slug}`} className="block overflow-hidden bg-surface-700 aspect-[4/3] relative">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl opacity-20 font-mono font-bold text-brand-400">
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning">Only {product.stock} left</Badge>
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="error">Out of stock</Badge>
                  </div>
                )}
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={CATEGORY_COLORS[product.category] ?? 'cyan'}>
                    {product.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                  {product.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs text-slate-500 bg-surface-700 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/store/${product.slug}`} className="block mb-1 group/title">
                  <h3 className="font-bold text-white text-lg group-hover/title:text-brand-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-brand-400 font-medium mb-2">{product.tagline}</p>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
                    <span className="text-xs text-slate-500 ml-1.5">+ free shipping</span>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/store">
            <Button size="lg" rightIcon={<ShoppingCart className="w-5 h-5" />}>
              Shop All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
