'use client'

import { useState } from 'react'
import { Play, Image as ImageIcon } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { MediaItem, MediaCategory } from '@/types'

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  conference: 'Conferences',
  workshop:   'Workshops',
  product:    'Products',
  research:   'Research',
  demo:       'Demos',
  misc:       'Misc',
}

const CATEGORY_BADGE: Record<MediaCategory, 'cyan' | 'purple' | 'success' | 'info' | 'warning' | 'error'> = {
  conference: 'cyan',
  workshop:   'purple',
  product:    'success',
  research:   'info',
  demo:       'warning',
  misc:       'error',
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

interface Props {
  items: MediaItem[]
}

export default function MediaGallery({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState<MediaCategory | 'all'>('all')
  const [lightbox, setLightbox] = useState<MediaItem | null>(null)

  const categories = Array.from(new Set(items.map(i => i.category))) as MediaCategory[]

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(i => i.category === activeCategory)

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeCategory === 'all'
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-surface-800 text-slate-400 border-brand-subtle hover:text-slate-200 hover:border-brand-medium'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeCategory === cat
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-surface-800 text-slate-400 border-brand-subtle hover:text-slate-200 hover:border-brand-medium'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No media yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => {
            const ytThumb = item.type === 'video' ? getYouTubeThumbnail(item.url) : null
            const thumbSrc = item.thumbnail || ytThumb || item.url

            return (
              <div
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group relative rounded-xl overflow-hidden border border-brand-subtle bg-surface-800 aspect-square cursor-pointer hover:border-brand-medium transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbSrc}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    <Badge variant={CATEGORY_BADGE[item.category] ?? 'cyan'} className="mt-1 capitalize">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </Badge>
                  </div>
                </div>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-brand-500/80 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-4xl w-full rounded-2xl overflow-hidden bg-surface-800 border border-brand-subtle"
            onClick={e => e.stopPropagation()}
          >
            {lightbox.type === 'video' ? (
              <div className="aspect-video">
                {(() => {
                  const match = lightbox.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
                  return match ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${match[1]}?autoplay=1`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      Unsupported video URL
                    </div>
                  )
                })()}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain" />
            )}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{lightbox.title}</p>
                {lightbox.description && (
                  <p className="text-slate-400 text-sm mt-0.5">{lightbox.description}</p>
                )}
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="text-slate-500 hover:text-slate-300 text-sm px-3 py-1.5 rounded-lg hover:bg-surface-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
