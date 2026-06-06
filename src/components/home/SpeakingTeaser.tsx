import Link from 'next/link'
import { ArrowRight, Mic, Calendar, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const EVENTS = [
  {
    title: 'BLE Attack Vectors in Consumer IoT',
    event: 'Null Delhi Chapter',
    type: 'conference',
    date: '2025',
    location: 'Delhi, India',
    description: 'Workshop demonstrating practical BLE attack techniques using ESP32-based tools.',
  },
  {
    title: 'Hacking the Spectrum: RF Security 101',
    event: 'Local Hackerspace',
    type: 'workshop',
    date: '2025',
    location: 'Delhi, India',
    description: 'Hands-on workshop covering 315/433MHz replay attacks and RF security fundamentals.',
  },
  {
    title: 'Building Offensive Hardware from Scratch',
    event: 'DefCon India Discord',
    type: 'webinar',
    date: '2025',
    location: 'Online',
    description: 'Talk covering hardware design workflow, ESP32 firmware development, and open-source security tools.',
  },
]

export default function SpeakingTeaser() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS.map(event => (
            <div key={event.title} className="glow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-brand-400" />
                </div>
                <Badge variant={event.type === 'conference' ? 'cyan' : event.type === 'workshop' ? 'purple' : 'info'}>
                  {event.type}
                </Badge>
              </div>
              <h3 className="font-bold text-white mb-2">{event.title}</h3>
              <p className="text-brand-400 text-sm font-medium mb-1">{event.event}</p>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
