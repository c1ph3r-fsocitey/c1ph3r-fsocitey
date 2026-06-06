import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AddToCartButton from '@/components/store/AddToCartButton'

// Static featured products — in production, fetch from Supabase
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'DisruptorX',
    slug: 'disruptorx',
    tagline: 'Advanced BLE Jammer & Analyzer',
    description: 'Multi-functional BLE jammer, scanner, analyzer, and spoofer. ESP32-based with signal scanning, spoofing, and Sour Apple exploit.',
    price: 59.99,
    images: ['https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png'],
    category: 'ble-tools',
    stock: 10,
    is_featured: true,
    tags: ['BLE', 'ESP32', 'Jammer'],
  },
  {
    id: '2',
    name: 'RF Annihilator',
    slug: 'rf-annihilator',
    tagline: 'Professional RF Testing Tool',
    description: 'Advanced RF signal generator, analyzer, and cloning tool. 315MHz, 433MHz and ISM bands. Replay attacks, protocol reverse engineering.',
    price: 59.99,
    images: ['https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg'],
    category: 'rf-tools',
    stock: 3,
    is_featured: true,
    tags: ['RF', '433MHz', 'ESP32'],
  },
  {
    id: '3',
    name: 'Spectrum Slayer HellSpawn',
    slug: 'spectrum-slayer-hellspawn',
    tagline: '5GHz WiFi Deauthenticator',
    description: 'Advanced 5GHz WiFi security assessment tool. Targeted deauth, controlled interference testing, compact and USB-powered.',
    price: 59.99,
    images: ['https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png'],
    category: 'wifi-tools',
    stock: 3,
    is_featured: true,
    tags: ['WiFi 5GHz', 'Deauther', 'ESP32'],
  },
  {
    id: '4',
    name: 'WiFi BLE Pentest Pro',
    slug: 'wifi-ble-pentest-pro',
    tagline: 'Wireless Security Assessment Platform',
    description: 'All-in-one WiFi + BLE toolkit. Evil twin, rogue AP, BLE sniffing, Evil Portal. GhostESP firmware compatible.',
    price: 59.99,
    images: ['https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png'],
    category: 'multi-tools',
    stock: 2,
    is_featured: true,
    tags: ['WiFi', 'BLE', 'GhostESP'],
  },
  {
    id: '5',
    name: 'Marauder OG',
    slug: 'marauder-og',
    tagline: 'ESP32 Marauder + GPS',
    description: 'Upgraded ESP32 Marauder toolkit with onboard GPS for wardriving, signal mapping, and location-based security research.',
    price: 59.99,
    images: ['https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg'],
    category: 'wifi-tools',
    stock: 5,
    is_featured: true,
    tags: ['Marauder', 'GPS', 'Wardriving'],
  },
  {
    id: '6',
    name: 'BLE STLTHFCKR',
    slug: 'ble-stlthfckr',
    tagline: 'Stealth BLE Device',
    description: 'Compact, stealth BLE research device. Huge range with external antenna support. Perfect for BLE reconnaissance.',
    price: 30.00,
    images: [],
    category: 'ble-tools',
    stock: 15,
    is_featured: true,
    tags: ['BLE', 'Stealth', 'Recon'],
  },
] as const

const CATEGORY_COLORS: Record<string, 'cyan' | 'purple' | 'info' | 'success'> = {
  'ble-tools':   'cyan',
  'wifi-tools':  'info',
  'rf-tools':    'purple',
  'multi-tools': 'success',
}

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-grid">
      <div className="section-container">
        {/* Header */}
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.id} className="glow-card group flex flex-col">
              {/* Image */}
              <Link href={`/store/${product.slug}`} className="block overflow-hidden bg-surface-700 aspect-[4/3] relative">
                {product.images[0] ? (
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
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={CATEGORY_COLORS[product.category] || 'cyan'}>
                    {product.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                  {product.tags.slice(0, 2).map(tag => (
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
                  <AddToCartButton product={product as any} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/store">
            <Button size="lg" rightIcon={<ShoppingCart className="w-5 h-5" />}>
              Shop All 9 Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
