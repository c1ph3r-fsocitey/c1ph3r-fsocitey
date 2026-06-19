'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, MapPin, Video, FileText, Globe } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { SpeakingEvent } from '@/types'

const TYPE_CONFIG: Record<string, { variant: 'cyan' | 'purple' | 'info' | 'success' | 'warning' }> = {
  conference: { variant: 'cyan' },
  workshop:   { variant: 'purple' },
  webinar:    { variant: 'info' },
  podcast:    { variant: 'success' },
  demo:       { variant: 'warning' },
}

export default function SpeakingEventCard({ event }: { event: SpeakingEvent }) {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const typeCfg = TYPE_CONFIG[event.event_type] ?? { variant: 'info' as const }

  const detect = (img: HTMLImageElement) => {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setOrientation(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait')
    }
  }

  // Handle images already in browser cache (onLoad won't fire)
  useEffect(() => {
    if (imgRef.current) detect(imgRef.current)
  }, [])

  const isPortrait = orientation === 'portrait'

  return (
    <div className={`glow-card overflow-hidden ${event.cover_image ? (isPortrait ? 'flex flex-col sm:flex-row' : 'flex flex-col') : ''}`}>

      {/* Image */}
      {event.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={event.cover_image}
          alt={event.title}
          onLoad={e => detect(e.currentTarget)}
          className={
            isPortrait
              ? 'w-full sm:w-56 sm:h-auto h-56 object-cover flex-shrink-0'
              : 'w-full object-cover'
          }
          style={isPortrait ? undefined : { height: '20rem' }}
        />
      )}

      {/* Content */}
      <div className="p-7 flex flex-col md:flex-row gap-6 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={typeCfg.variant}>{event.event_type}</Badge>
            {event.is_online && <Badge variant="info">Online</Badge>}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
          <p className="text-brand-400 font-medium mb-3">{event.event_name}</p>
          <p className="text-slate-400 leading-relaxed mb-4">{event.description}</p>
          <div className="flex flex-wrap gap-2">
            {event.tags?.map(tag => (
              <span key={tag} className="tech-badge">{tag}</span>
            ))}
          </div>
        </div>

        <div className="md:w-44 flex flex-col gap-3 md:text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 md:justify-end">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {event.is_online ? (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 md:justify-end">
              <Globe className="w-4 h-4 flex-shrink-0" />
              Online
            </div>
          ) : event.location && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 md:justify-end">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {event.location}
            </div>
          )}
          <div className="flex items-center gap-2 md:justify-end mt-1">
            {event.video_url && (
              <a href={event.video_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                <Video className="w-4 h-4" />
                Video
              </a>
            )}
            {event.slides_url && (
              <a href={event.slides_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                <FileText className="w-4 h-4" />
                Slides
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
