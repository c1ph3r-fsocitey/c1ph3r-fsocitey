import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { MediaItem } from '@/types'
import MediaGallery from './MediaGallery'

export const metadata: Metadata = {
  title: 'Media Gallery',
  description: 'Photos, videos, conference appearances, and press coverage from C1ph3r Fsociety.',
}

export default async function MediaPage() {
  const supabase = createClient()
  const { data: items } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false })

  const allItems: MediaItem[] = items ?? []

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
          <MediaGallery items={allItems} />
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
