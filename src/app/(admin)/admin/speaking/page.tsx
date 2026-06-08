'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, ExternalLink, Mic, Video, Globe, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { SpeakingEvent } from '@/types'

const TYPE_BADGE: Record<string, 'cyan' | 'purple' | 'success' | 'info' | 'warning' | 'error'> = {
  conference: 'cyan',
  workshop:   'purple',
  webinar:    'info',
  podcast:    'success',
  demo:       'warning',
}

export default function AdminSpeakingPage() {
  const [events, setEvents] = useState<SpeakingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('speaking_events')
        .select('*')
        .order('date', { ascending: false })
      setEvents(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const upcoming = events.filter(e => new Date(e.date) >= new Date())
  const past = events.filter(e => new Date(e.date) < new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Speaking & Workshops</h1>
          <p className="text-slate-500 text-sm">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <Link href="/admin/speaking/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Event</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <Mic className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No events yet.</p>
          <Link href="/admin/speaking/new" className="mt-4 inline-block">
            <Button size="sm" variant="ghost">Add your first event →</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map(ev => <EventRow key={ev.id} event={ev} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Past</h2>
              <div className="space-y-3">
                {past.map(ev => <EventRow key={ev.id} event={ev} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventRow({ event }: { event: SpeakingEvent }) {
  return (
    <div className="glow-card p-5 flex items-start gap-4 hover:border-brand-500/30 transition-colors">
      {/* Date block */}
      <div className="flex-shrink-0 w-14 text-center">
        <div className="text-brand-400 text-xs font-medium">
          {formatDate(event.date, 'MMM')}
        </div>
        <div className="text-white text-2xl font-bold leading-tight">
          {formatDate(event.date, 'd')}
        </div>
        <div className="text-slate-500 text-xs">
          {formatDate(event.date, 'yyyy')}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white leading-snug">{event.title}</h3>
            <p className="text-brand-400 text-sm mt-0.5">{event.event_name}</p>
          </div>
          <Badge variant={TYPE_BADGE[event.event_type] ?? 'info'} className="capitalize flex-shrink-0">
            {event.event_type}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          {event.is_online ? (
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Online</span>
          ) : event.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
          )}
          {event.tags?.length > 0 && (
            <span>{event.tags.slice(0, 3).join(', ')}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Link href={`/admin/speaking/${event.id}`}>
          <button className="p-2 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </Link>
        {event.video_url && (
          <a href={event.video_url} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
            <Video className="w-4 h-4" />
          </a>
        )}
        {event.event_url && (
          <a href={event.event_url} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
