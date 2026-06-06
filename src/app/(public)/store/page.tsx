import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatPrice } from '@/lib/utils/format'

export const metadata: Metadata = {
  title: 'Hardware Store',
  description: 'Shop cybersecurity research hardware: BLE jammers, WiFi deauthers, RF tools, and more. Built by C1ph3r Fsociety, shipped from Delhi, India.',
}

// Full product catalog with all 9 products from Tindie
const ALL_PRODUCTS = [
  {
    id: '1', name: 'DisruptorX', slug: 'disruptorx',
    tagline: 'Advanced BLE Jammer & Analyzer',
    description: 'Multi-functional BLE jammer, scanner, analyzer, and spoofer. ESP32 Wroom32-based. Sour Apple exploit support.',
    price: 59.99, stock: 10, category: 'ble-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png'],
    tags: ['BLE', 'ESP32', 'Jammer', 'Spoofer'],
    specs: { 'Module': 'ESP32 Wroom32', 'Protocol': 'BLE 4.0/5.0', 'Power': 'USB-C' },
    features: ['BLE Jamming', 'Signal Scanning', 'BLE Spoofing', 'BLE Analyzer', 'Sour Apple Exploit'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '2', name: 'DisruptorX V2', slug: 'disruptorx-v2',
    tagline: 'BLE Jammer & Analyzer — Gen 2',
    description: 'Upgraded version of DisruptorX with improved BLE jamming, scanning, spoofing, and analysis capabilities.',
    price: 59.99, stock: 8, category: 'ble-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/tRHmu08bONrVPUoTnv_yKWvJEPc=/p/114x76/i/531155/products/2025-07-04T13:42:19.518Z-FreqFuckerUltra..jpeg'],
    tags: ['BLE', 'ESP32', 'V2', 'Jammer'],
    specs: { 'Module': 'ESP32 Wroom32', 'Protocol': 'BLE 4.0/5.0', 'Power': 'USB-C' },
    features: ['Enhanced BLE Jamming', 'Signal Scanning', 'BLE Spoofing', 'Updated Firmware'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '3', name: 'RF Annihilator', slug: 'rf-annihilator',
    tagline: 'Professional RF Testing Tool',
    description: 'Advanced RF signal generator, analyzer, and cloning tool. 315MHz, 433MHz, and ISM bands. Replay attacks and protocol reverse engineering.',
    price: 59.99, stock: 3, category: 'rf-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg'],
    tags: ['RF', '315MHz', '433MHz', 'ESP32'],
    specs: { 'Module': 'ESP32', 'Frequency': '315MHz, 433MHz, ISM', 'Power': 'USB-C' },
    features: ['Signal Cloning', 'Multi-Frequency', 'Advanced Analysis', 'Raw Data Capture', 'Open Source'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '4', name: 'Spectrum Slayer HellSpawn', slug: 'spectrum-slayer-hellspawn',
    tagline: '5GHz WiFi Deauthenticator',
    description: 'Advanced 5GHz Wi-Fi security assessment tool. Targeted deauth, controlled interference testing, DFS channel support.',
    price: 59.99, stock: 3, category: 'wifi-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png'],
    tags: ['WiFi 5GHz', 'Deauther', 'BW16', 'USB-C'],
    specs: { 'Module': 'AI-Thinker BW16', 'Frequency': '5GHz WiFi', 'Power': 'USB-C' },
    features: ['5GHz Targeting', 'Deauthentication', 'DFS Support', 'Open Source Firmware', 'USB Powered'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '5', name: 'RF Fucker', slug: 'rf-fucker',
    tagline: 'Multi-Band RF Research Tool',
    description: 'Compact RF research tool for multi-band signal analysis and testing. Ideal for ISM band security research.',
    price: 49.99, stock: 10, category: 'rf-tools', is_featured: false,
    images: [],
    tags: ['RF', 'Multi-Band', 'ESP32'],
    specs: { 'Module': 'ESP32', 'Protocol': 'ISM Bands', 'Power': 'USB-C' },
    features: ['Multi-Band Support', 'Signal Analysis', 'Compact Design'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '6', name: 'WiFi BLE Pentest Pro', slug: 'wifi-ble-pentest-pro',
    tagline: 'Wireless Security Assessment Platform',
    description: 'All-in-one WiFi + BLE toolkit. Evil twin, rogue AP, BLE sniffing, Evil Portal. GhostESP firmware compatible.',
    price: 59.99, stock: 2, category: 'multi-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png'],
    tags: ['WiFi', 'BLE', 'GhostESP', 'Evil Twin'],
    specs: { 'Module': 'ESP32', 'Protocols': 'WiFi 2.4/5GHz + BLE', 'Power': 'USB-C' },
    features: ['Network Scanning', 'Packet Capture', 'Rogue AP', 'Evil Portal', 'BLE Sniffing'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '7', name: 'Marauder OG', slug: 'marauder-og',
    tagline: 'ESP32 Marauder + GPS',
    description: 'Upgraded ESP32 Marauder with onboard GPS. Wardriving, signal mapping, location-based security research. Pre-flashed, plug and play.',
    price: 59.99, stock: 5, category: 'wifi-tools', is_featured: true,
    images: ['https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg'],
    tags: ['Marauder', 'GPS', 'Wardriving', 'ESP32'],
    specs: { 'Module': 'ESP32 Marauder', 'Extra': 'Integrated GPS', 'Power': 'USB-C' },
    features: ['GPS Integration', 'Pre-flashed Marauder', 'Wardriving', 'WiFi + BLE Scan', 'USB Portable'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '8', name: 'BLE STLTHFCKR', slug: 'ble-stlthfckr',
    tagline: 'Stealth BLE Research Device',
    description: 'Compact, stealthy BLE research device. Huge range with external antenna support. Perfect for BLE reconnaissance.',
    price: 30.00, stock: 15, category: 'ble-tools', is_featured: true,
    images: [],
    tags: ['BLE', 'Stealth', 'Recon', 'External Antenna'],
    specs: { 'Protocol': 'BLE', 'Antenna': 'External SMA', 'Power': 'USB' },
    features: ['Stealth Design', 'External Antenna Support', 'Long Range', 'BLE Recon'],
    legal_disclaimer: 'For authorized testing only.',
  },
  {
    id: '9', name: 'DeskMate Mochi', slug: 'deskmate-mochi',
    tagline: 'Cute Educational Desktop Companion',
    description: 'A friendly desktop companion for makers and hackers. Educational kit — perfect for learning embedded systems basics.',
    price: 39.99, stock: 20, category: 'educational', is_featured: false,
    images: [],
    tags: ['Educational', 'Desktop', 'Fun', 'ESP32'],
    specs: { 'Module': 'ESP32', 'Category': 'Educational' },
    features: ['Educational', 'Desktop Widget', 'Programmable'],
    legal_disclaimer: null,
  },
]

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

export default function StorePage() {
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
          <p className="text-slate-400 text-lg mb-8">
            All hardware is designed, assembled, and shipped from Delhi, India.
            Open-source firmware. Free worldwide shipping.
          </p>
          {/* Legal notice */}
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-sm text-amber-400/80">
            ⚠️ For authorized ethical hacking & security research only. Buyers must be 18+.
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding">
        <div className="section-container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    cat.value === 'all'
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-surface-800 text-slate-400 border-brand-subtle hover:text-slate-200 hover:border-brand-medium'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">{ALL_PRODUCTS.length} products</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_PRODUCTS.map(product => (
              <div key={product.id} className="glow-card group flex flex-col">
                {/* Image */}
                <Link href={`/store/${product.slug}`} className="block overflow-hidden bg-surface-700 aspect-[4/3] relative">
                  {product.images[0] ? (
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
                  {(product.stock as number) === 0 && (
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
                      <span className="text-xs text-slate-500 ml-1">free ship</span>
                    </div>
                    <AddToCartButton product={product as any} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
