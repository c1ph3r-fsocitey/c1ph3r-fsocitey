import type { Metadata } from 'next'
import { Play, Image as ImageIcon, ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Media Gallery',
  description: 'Photos, videos, conference appearances, and press coverage from C1ph3r Fsociety.',
}

const MEDIA_CATEGORIES = ['All', 'Products', 'Conferences', 'Workshops', 'Research', 'Demos']

// Static placeholder — will be managed via admin + Supabase
const MEDIA_ITEMS = [
  { id: '1', type: 'image', title: 'DisruptorX Hardware', category: 'Products', url: 'https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png', thumbnail: 'https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png' },
  { id: '2', type: 'image', title: 'RF Annihilator', category: 'Products', url: 'https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg', thumbnail: 'https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg' },
  { id: '3', type: 'image', title: 'Spectrum Slayer HellSpawn', category: 'Products', url: 'https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png', thumbnail: 'https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png' },
  { id: '4', type: 'image', title: 'Marauder OG', category: 'Products', url: 'https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg', thumbnail: 'https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg' },
  { id: '5', type: 'image', title: 'WiFi BLE Pentest Pro', category: 'Products', url: 'https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png', thumbnail: 'https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png' },
  { id: '6', type: 'image', title: 'DisruptorX V2', category: 'Products', url: 'https://img.tindie.com/images/resize/tRHmu08bONrVPUoTnv_yKWvJEPc=/p/114x76/i/531155/products/2025-07-04T13:42:19.518Z-FreqFuckerUltra..jpeg', thumbnail: 'https://img.tindie.com/images/resize/tRHmu08bONrVPUoTnv_yKWvJEPc=/p/114x76/i/531155/products/2025-07-04T13:42:19.518Z-FreqFuckerUltra..jpeg' },
]

export default function MediaPage() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">Media Gallery</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Photos, Videos &{' '}
            <span className="gradient-text">Press</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Product photography, conference appearances, workshop footage, and research demos.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="section-container">
          {/* Category filters (client-side filtering can be added) */}
          <div className="flex flex-wrap gap-2 mb-10">
            {MEDIA_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  cat === 'All'
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-surface-800 text-slate-400 border-brand-subtle hover:text-slate-200 hover:border-brand-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MEDIA_ITEMS.map(item => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-brand-subtle bg-surface-800 aspect-square cursor-pointer hover:border-brand-medium transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    <Badge variant="cyan" className="mt-1">{item.category}</Badge>
                  </div>
                </div>
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-500/80 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add more placeholder */}
            <div className="rounded-xl border border-dashed border-brand-subtle bg-surface-800/50 aspect-square flex flex-col items-center justify-center gap-2 text-slate-600">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">More coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="section-padding border-t border-brand-subtle bg-surface-800/30">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-white mb-8">Press & Mentions</h2>
          <div className="glow-card p-8 text-center">
            <p className="text-slate-500 mb-2">Press mentions and interviews coming soon.</p>
            <p className="text-slate-600 text-sm">
              For press inquiries, contact{' '}
              <a href="mailto:rahulthegreat2001@gmail.com" className="text-brand-400 hover:text-brand-300">
                rahulthegreat2001@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
