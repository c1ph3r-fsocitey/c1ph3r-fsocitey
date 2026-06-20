import Link from 'next/link'
import { ArrowRight, Mic, Calendar, MapPin, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { SpeakingEvent } from '@/types'

const TYPE_VARIANT: Record<string, 'cyan' | 'purple' | 'info' | 'warning' | 'success'> = {
  conference: 'cyan',
  workshop:   'purple',
  webinar:    'info',
  demo:       'warning',
  podcast:    'success',
}

export default function SpeakingTeaser({ events }: { events: SpeakingEvent[] }) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="section-eyebrow mb-3">Speaking & Workshops</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Sharing Knowledge{' '}
              <span className="gradient-text">Publicly</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl text-balance">
              Talks, workshops, and demos at security conferences, hackerspaces, and community events.
              Available for speaking engagements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/contact?type=speaking">
              <Button variant="outline">Book a Talk</Button>
            </Link>
            <Link href="/speaking">
              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                All Events
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Mic className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Speaking events coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="glow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-brand-400" />
                  </div>
                  <Badge variant={TYPE_VARIANT[event.event_type] ?? 'info'}>
                    {event.event_type}
                  </Badge>
                </div>
                <h3 className="font-bold text-white mb-2">{event.title}</h3>
                <p className="text-brand-400 text-sm font-medium mb-1">{event.event_name}</p>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(event.date).getFullYear()}
                  </span>
                  <span className="flex items-center gap-1">
                    {event.is_online
                      ? <><Globe className="w-3.5 h-3.5" /> Online</>
                      : <><MapPin className="w-3.5 h-3.5" /> {event.location}</>
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
