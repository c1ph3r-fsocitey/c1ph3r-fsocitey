import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import type { SpeakingEvent } from '@/types'
import SpeakingEventCard from './SpeakingEventCard'

export const metadata: Metadata = {
  title: 'Speaking & Workshops',
  description: 'Conference talks, workshops, and demos by Rahul Thareja of C1ph3r Fsociety. Available for speaking engagements.',
}

export default async function SpeakingPage() {
  const supabase = createClient()
  const { data: events } = await supabase
    .from('speaking_events')
    .select('*')
    .order('date', { ascending: false })

  const allEvents: SpeakingEvent[] = events ?? []

  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-eyebrow mb-4">Speaking & Workshops</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sharing What I&apos;ve{' '}
                <span className="gradient-text">Learned</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                I give talks at security meetups, run hands-on hardware workshops,
                and participate in community webinars. The goal is always the same:
                make security research more accessible and practical.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/contact?type=speaking">
                  <Button>Book a Talk or Workshop</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary">Get in Touch</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: `${allEvents.length}+`, label: 'Events' },
                { value: `${new Set(allEvents.map(e => e.event_type)).size}`, label: 'Formats' },
                { value: '100+', label: 'Attendees Reached' },
                { value: '2025', label: 'Active Since' },
              ].map(stat => (
                <div key={stat.label} className="glow-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-white mb-8">Past Events</h2>

          {allEvents.length === 0 ? (
            <div className="glow-card p-12 text-center">
              <Mic className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No events yet — check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allEvents.map(event => (
                <SpeakingEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Speaking topics */}
      <section className="section-padding border-t border-brand-subtle bg-surface-800/30">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Available Topics</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              I can speak on or run workshops around these themes. Custom topics available on request.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Wireless Security Fundamentals',
                desc: 'BLE, WiFi, RF — practical attack and defense for engineers and developers. Suitable for all levels.',
                format: ['Talk', 'Workshop'],
              },
              {
                title: 'Building Security Hardware',
                desc: 'From schematic to shipped product. KiCad, ESP32, PlatformIO, and lessons from running a hardware startup.',
                format: ['Talk', 'Workshop'],
              },
              {
                title: 'Red Team Tools & Methodology',
                desc: 'Hands-on offensive security tooling for authorized engagements. Legal, ethical, and practical.',
                format: ['Talk', 'Workshop', 'Webinar'],
              },
            ].map(topic => (
              <div key={topic.title} className="glow-card p-6">
                <div className="flex gap-2 mb-4">
                  {topic.format.map(f => (
                    <Badge key={f} variant="cyan">{f}</Badge>
                  ))}
                </div>
                <h3 className="font-bold text-white mb-2">{topic.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact?type=speaking">
              <Button size="lg">Book a Speaking Engagement</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
