import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Security research, hardware tutorials, and technical write-ups from C1ph3r Fsociety.',
}

// Placeholder posts — in production, fetch from Supabase
const POSTS = [
  {
    slug: 'building-ble-jammer-esp32',
    title: 'Building a BLE Jammer from Scratch with ESP32',
    excerpt: 'A deep dive into BLE signal architecture, why jamming works, and how to implement it cleanly in firmware — the full engineering story behind DisruptorX.',
    cover_image: null,
    tags: ['BLE', 'ESP32', 'Tutorial', 'Hardware'],
    categories: ['Research', 'Tutorial'],
    published_at: '2025-11-10',
    reading_time: 12,
    author: 'Rahul Thareja',
  },
  {
    slug: '5ghz-deauth-still-possible-2025',
    title: '5GHz Deauthentication is Still Possible in 2025 — Here\'s Why',
    excerpt: '802.11w exists. WPA3 exists. And yet we can still deauth 5GHz networks with a cheap ESP32 module. A research breakdown of what the spec says vs. what happens in practice.',
    cover_image: null,
    tags: ['WiFi', '5GHz', 'Research', 'Deauth'],
    categories: ['Research'],
    published_at: '2025-10-18',
    reading_time: 8,
    author: 'Rahul Thareja',
  },
  {
    slug: 'rf-replay-attacks-433mhz',
    title: 'How RF Replay Attacks Work at 433MHz',
    excerpt: 'Capturing, analyzing, and replaying 433MHz signals from garage doors and wireless sensors using the RF Annihilator. A practical tutorial with real captures.',
    cover_image: null,
    tags: ['RF', '433MHz', 'Replay', 'Tutorial'],
    categories: ['Tutorial', 'Research'],
    published_at: '2025-09-05',
    reading_time: 10,
    author: 'Rahul Thareja',
  },
  {
    slug: 'kicad-pcb-design-esp32',
    title: 'Designing Your First ESP32 PCB in KiCad',
    excerpt: 'Step-by-step walkthrough of designing an ESP32-based security research tool PCB: schematic capture, layout rules for RF, and ordering from JLCPCB.',
    cover_image: null,
    tags: ['KiCad', 'PCB Design', 'ESP32', 'Hardware'],
    categories: ['Tutorial'],
    published_at: '2025-08-15',
    reading_time: 15,
    author: 'Rahul Thareja',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-grid">
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Research, Tutorials &{' '}
            <span className="gradient-text">Technical Write-ups</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Deep dives into security hardware, firmware development, and wireless protocol research.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <div className="space-y-6">
            {POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="glow-card p-7">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {post.categories.map(cat => (
                          <Badge key={cat} variant="cyan">{cat}</Badge>
                        ))}
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tech-badge">{tag}</span>
                        ))}
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.reading_time} min read
                        </span>
                        <span>{post.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center md:items-end md:justify-end">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 group-hover:text-brand-300 transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
