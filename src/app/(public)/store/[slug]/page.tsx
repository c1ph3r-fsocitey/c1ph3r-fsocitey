import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, Package, Truck, ChevronLeft, Github, AlertTriangle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatPrice } from '@/lib/utils/format'

// Static product data — in production fetch from Supabase
const PRODUCTS: Record<string, any> = {
  'disruptorx': {
    id: '1', name: 'DisruptorX', slug: 'disruptorx',
    tagline: 'Advanced BLE Jammer, Scanner, Analyzer & Spoofer',
    description: 'DisruptorX is a powerful multi-functional device designed to analyze, jam, spoof, and disrupt Bluetooth Low Energy (BLE) signals. Based on the ESP32 Wroom32 module, it comes equipped with advanced features to target and attack Bluetooth devices. Whether you\'re performing red team engagements or studying BLE networks, this tool serves multiple purposes, from signal analysis to jamming and spoofing.',
    price: 59.99, stock: 10, category: 'ble-tools',
    images: ['https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png'],
    tags: ['BLE', 'ESP32', 'Jammer', 'Scanner', 'Spoofer'],
    specs: { 'Core Module': 'ESP32 Wroom32', 'Protocol': 'Bluetooth Low Energy 4.0/5.0', 'Power': 'USB-C', 'Firmware': 'Open Source (Arduino compatible)', 'Category': 'Network, Signal Jamming' },
    features: ['Signal Jamming — Jams BLE signals across a wide range of devices', 'Signal Scanning — Scans for nearby BLE devices', 'Signal Spoofing — Spoofs BLE signals to impersonate legitimate devices', 'BLE Analyzer — Analyzes BLE packets and interactions', 'Sour Apple — Exploits vulnerabilities by injecting malicious signals'],
    legal_disclaimer: 'Tool Category: Network, Signal Jamming. For authorized testing, red team engagements, and educational purposes ONLY. Unauthorized use may violate local laws.',
  },
  'disruptorx-v2': {
    id: '2', name: 'DisruptorX V2', slug: 'disruptorx-v2',
    tagline: 'BLE Jammer & Analyzer — Generation 2',
    description: 'DisruptorX V2 is an upgraded multi-functional device designed to analyze, jam, spoof, and disrupt Bluetooth Low Energy (BLE) signals. Based on the ESP32 Wroom32 module with improved capabilities over the original DisruptorX.',
    price: 59.99, stock: 8, category: 'ble-tools',
    images: ['https://img.tindie.com/images/resize/tRHmu08bONrVPUoTnv_yKWvJEPc=/p/114x76/i/531155/products/2025-07-04T13:42:19.518Z-FreqFuckerUltra..jpeg'],
    tags: ['BLE', 'ESP32', 'V2', 'Jammer', 'Improved'],
    specs: { 'Core Module': 'ESP32 Wroom32', 'Protocol': 'Bluetooth Low Energy 4.0/5.0', 'Power': 'USB-C', 'Firmware': 'Open Source' },
    features: ['Enhanced BLE Jamming', 'Improved Signal Scanning', 'BLE Spoofing', 'Sour Apple Exploit', 'Updated Firmware'],
    legal_disclaimer: 'For authorized testing, red team engagements, and educational purposes ONLY.',
  },
  'rf-annihilator': {
    id: '3', name: 'RF Annihilator', slug: 'rf-annihilator',
    tagline: 'Professional RF Testing Tool for Security Research',
    description: 'Unleash the power of radio frequency analysis with the RF Annihilator, an advanced RF signal generator, analyzer, and cloning tool designed for security professionals, penetration testers, and wireless researchers. This compact, field-ready device enables you to capture, replicate, and analyze RF signals across common frequencies (315MHz, 433MHz, and beyond), making it an essential tool for testing wireless security, reverse engineering protocols, and hardening systems against RF-based vulnerabilities.',
    price: 59.99, stock: 3, category: 'rf-tools',
    images: ['https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg'],
    tags: ['RF', '315MHz', '433MHz', 'ISM', 'ESP32', 'Replay'],
    specs: { 'Core Module': 'ESP32', 'Frequency Range': '315MHz, 433MHz, ISM Bands', 'Connectivity': 'USB-C', 'Firmware': 'Open Source (Arduino/Rust compatible)' },
    features: ['Precision Signal Cloning — Record and replay RF signals', 'Multi-Frequency Signal Generation — 315MHz, 433MHz, ISM bands', 'Advanced Signal Analysis — Real-time capture and inspection', 'Raw Data Capture & Export — For SDR tool integration', 'Open-Source Firmware — ESP32-based, fully customizable'],
    legal_disclaimer: 'For authorized penetration testing, security research, IoT development, and education ONLY. Never use for unauthorized access. Compliance with local laws required.',
  },
  'spectrum-slayer-hellspawn': {
    id: '4', name: 'Spectrum Slayer HellSpawn', slug: 'spectrum-slayer-hellspawn',
    tagline: '5GHz Wi-Fi Deauthenticator Tool',
    description: 'The Spectrum Slayer HellSpawn is an advanced 5GHz Wi-Fi security assessment tool designed for ethical hackers, penetration testers, and network security professionals. Built around the AI-Thinker BW16 module, this compact device enables controlled 5GHz deauthentication and network resilience testing.',
    price: 59.99, stock: 3, category: 'wifi-tools',
    images: ['https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png'],
    tags: ['WiFi 5GHz', 'Deauther', 'AI-Thinker BW16', 'DFS'],
    specs: { 'Core Module': 'AI-Thinker BW16', 'Frequency': '5GHz WiFi (DFS channels)', 'Power': 'USB-C', 'Range': '~50m optimal', 'Firmware': 'Open Source (Arduino/PlatformIO)' },
    features: ['5GHz Band Targeting — Unlike 2.4GHz-only tools', 'Targeted Deauthentication — Controlled deauth packets', 'DFS Channel Support', 'Compact & USB-Powered', 'Open-Source Firmware'],
    legal_disclaimer: 'For authorized penetration testing, security training, IoT hardening, and red team exercises ONLY. Unauthorized use is strictly prohibited.',
  },
  'rf-fucker': {
    id: '5', name: 'RF Fucker', slug: 'rf-fucker',
    tagline: 'Multi-Band RF Research Tool',
    description: 'Compact RF research tool for multi-band signal analysis and testing across ISM bands. Ideal for security researchers studying wireless protocols.',
    price: 49.99, stock: 10, category: 'rf-tools',
    images: [],
    tags: ['RF', 'Multi-Band', 'ISM', 'ESP32'],
    specs: { 'Module': 'ESP32', 'Protocol': 'ISM Bands', 'Power': 'USB-C' },
    features: ['Multi-Band RF Support', 'Signal Analysis', 'Compact Design', 'Open Firmware'],
    legal_disclaimer: 'For authorized testing only.',
  },
  'wifi-ble-pentest-pro': {
    id: '6', name: 'WiFi BLE Pentest Pro', slug: 'wifi-ble-pentest-pro',
    tagline: 'Wireless Security Assessment Platform',
    description: 'The WiFi BLE Pentest Pro is an ESP32-based wireless security platform designed for professional penetration testers, red teams, and security researchers. This feature-rich toolkit enables authorized testing of WiFi (2.4GHz) and BLE networks through packet analysis, rogue AP deployment, Evil Portal simulations, and protocol assessment.',
    price: 59.99, stock: 2, category: 'multi-tools',
    images: ['https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png'],
    tags: ['WiFi 2.4GHz', 'BLE', 'GhostESP', 'Evil Twin', 'Rogue AP'],
    specs: { 'Core Module': 'ESP32 (GhostESP compatible)', 'Wireless': 'WiFi 2.4/5GHz + BLE', 'Power': 'USB-C', 'Range': 'WiFi ~100m, BLE ~10-30m', 'Docs': 'ghostesp.net' },
    features: ['Network Scanning & Recon', 'Packet Capture & Analysis', 'Rogue AP Deployment', 'Evil Portal (Captive Portal)', 'Beacon Spoofing', 'BLE Sniffing & Spoofing', 'Device Enumeration'],
    legal_disclaimer: 'For authorized penetration testing, red team exercises, IoT research, and security education ONLY.',
  },
  'marauder-og': {
    id: '7', name: 'Marauder OG', slug: 'marauder-og',
    tagline: 'ESP32 Marauder + GPS — Plug and Play',
    description: 'Introducing the ESP32 Marauder with GPS, a fully assembled, plug-and-play wireless security toolkit designed for WiFi pentesting, BLE scanning, wardriving, and advanced wireless reconnaissance. This upgraded version includes an integrated GPS module for accurate geolocation tagging.',
    price: 59.99, stock: 5, category: 'wifi-tools',
    images: ['https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg'],
    tags: ['Marauder', 'GPS', 'Wardriving', 'WiFi', 'BLE', 'Plug and Play'],
    specs: { 'Module': 'ESP32 Marauder', 'GPS': 'Integrated GPS Module', 'Power': 'USB-C / Power Bank', 'Firmware': 'Pre-flashed Marauder' },
    features: ['Integrated GPS Module — Location logging & wardriving', 'Pre-Flashed Marauder — Ready to use out of the box', 'Real-Time WiFi and BLE Scanning', 'Custom PCB with Clean Layout', 'USB-Powered & Fully Portable'],
    legal_disclaimer: 'For authorized pentesting and wireless research ONLY.',
  },
  'ble-stlthfckr': {
    id: '8', name: 'BLE STLTHFCKR', slug: 'ble-stlthfckr',
    tagline: 'Stealth BLE Research Device with External Antenna',
    description: 'Compact, stealthy BLE research device with external antenna support for massive range. Perfect for BLE reconnaissance and authorized testing.',
    price: 30.00, stock: 15, category: 'ble-tools',
    images: [],
    tags: ['BLE', 'Stealth', 'External Antenna', 'Long Range', 'Recon'],
    specs: { 'Protocol': 'Bluetooth Low Energy', 'Antenna': 'External SMA (12dBi compatible)', 'Form Factor': 'Compact / Stealth' },
    features: ['Stealth Form Factor', 'External Antenna Support (up to 12dBi)', 'Long Range BLE Recon', 'BLE Device Scanning'],
    legal_disclaimer: 'For authorized testing only.',
  },
  'deskmate-mochi': {
    id: '9', name: 'DeskMate Mochi', slug: 'deskmate-mochi',
    tagline: 'Cute Educational Desktop Companion',
    description: 'A friendly desktop companion for makers, hackers, and embedded systems learners. The DeskMate Mochi is a fun educational kit perfect for learning ESP32 programming and embedded systems fundamentals.',
    price: 39.99, stock: 20, category: 'educational',
    images: [],
    tags: ['Educational', 'Desktop', 'ESP32', 'Beginners', 'Fun'],
    specs: { 'Module': 'ESP32', 'Category': 'Educational Kit', 'Skill Level': 'Beginner to Intermediate' },
    features: ['Programmable via Arduino/PlatformIO', 'Educational & Fun', 'Desktop Widget', 'ESP32-Based'],
    legal_disclaimer: null,
  },
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = PRODUCTS[params.slug]
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description.slice(0, 160),
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug]
  if (!product) notFound()

  const CATEGORY_BADGE: Record<string, 'cyan' | 'info' | 'purple' | 'success' | 'warning'> = {
    'ble-tools': 'cyan', 'wifi-tools': 'info', 'rf-tools': 'purple',
    'multi-tools': 'success', 'educational': 'warning',
  }

  return (
    <div className="bg-grid">
      <div className="section-container py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/store" className="hover:text-brand-400 transition-colors">Store</Link>
          <span>/</span>
          <span className="text-slate-300">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-surface-800 border border-brand-subtle aspect-square flex items-center justify-center">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="text-8xl font-mono font-bold text-brand-400/20">
                  {product.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={CATEGORY_BADGE[product.category] || 'cyan'}>
                {product.category.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Badge>
              {product.stock <= 3 && product.stock > 0 && <Badge variant="warning">Only {product.stock} left</Badge>}
              {product.stock === 0 && <Badge variant="error">Out of Stock</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-brand-400 text-lg font-medium mb-4">{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-white">{formatPrice(product.price)}</span>
              <span className="text-sm text-green-400">+ Free Worldwide Shipping</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag: string) => (
                <span key={tag} className="tech-badge">{tag}</span>
              ))}
            </div>

            <p className="text-slate-400 leading-relaxed mb-8">{product.description}</p>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <AddToCartButton product={product} showLabel className="flex-1 py-3.5 text-base" />
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
            {product.legal_disclaimer && (
              <div className="flex gap-3 p-4 rounded-xl bg-amber-900/15 border border-amber-700/30">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400/80">{product.legal_disclaimer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="glow-card p-7">
            <h2 className="text-xl font-bold text-white mb-5">Key Features</h2>
            <ul className="space-y-3">
              {product.features.map((f: string) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                  <span className="text-sm text-slate-400">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glow-card p-7">
            <h2 className="text-xl font-bold text-white mb-5">Technical Specifications</h2>
            <dl className="space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-brand-subtle last:border-0">
                  <dt className="text-sm text-slate-500 font-medium">{key}</dt>
                  <dd className="text-sm text-slate-300 text-right">{value as string}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
