import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Calendar, MapPin, ExternalLink, Video, FileText } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Speaking & Workshops',
  description: 'Conference talks, workshops, and demos by Rahul Thareja of C1ph3r Fsociety. Available for speaking engagements.',
}

const EVENTS = [
  {
    id: '1',
    title: 'BLE Attack Vectors in Consumer IoT Devices',
    event: 'Null Delhi Chapter Monthly Meet',
    type: 'conference',
    date: '2025-11-15',
    location: 'Delhi, India',
    is_online: false,
    description: 'Live demonstration of BLE jamming, spoofing, and MITM attacks against consumer IoT devices using the DisruptorX platform. Covered attack methodology, toolchain, and defensive recommendations.',
    has_video: false,
    has_slides: true,
    tags: ['BLE', 'IoT', 'Live Demo', 'Delhi'],
  },
  {
    id: '2',
    title: 'Hacking the Spectrum: RF Security 101',
    event: 'Hackerspace Delhi',
    type: 'workshop',
    date: '2025-10-08',
    location: 'Delhi, India',
    is_online: false,
    description: 'Hands-on 3-hour workshop. Participants learned 315/433MHz signal capture and replay attacks using the RF Annihilator. Topics: SDR fundamentals, ISM band protocols, replay attack methodology.',
    has_video: false,
    has_slides: true,
    tags: ['RF', 'Workshop', 'Hands-on', 'SDR'],
  },
  {
    id: '3',
    title: 'Building Offensive Security Hardware from Scratch',
    event: 'DefCon India Discord Community',
    type: 'webinar',
    date: '2025-09-20',
    location: 'Online',
    is_online: true,
    description: 'Talk covering end-to-end hardware product design: KiCad schematic and PCB, JLCPCB fabrication, ESP32 firmware development in PlatformIO, and lessons from shipping to international customers.',
    has_video: true,
    has_slides: true,
    tags: ['Hardware Design', 'ESP32', 'PCB', 'KiCad'],
  },
  {
    id: '4',
    title: '5GHz Wi-Fi Deauthentication: Still a Problem in 2025',
    event: 'OWASP Delhi Chapter',
    type: 'conference',
    date: '2025-08-05',
    location: 'Delhi, India',
    is_online: false,
    description: 'Research presentation examining the persistence of deauthentication vulnerabilities despite 802.11w and WPA3. Live demo with Spectrum Slayer HellSpawn.',
    has_video: false,
    has_slides: true,
    tags: ['WiFi', 'Research', '802.11w', 'WPA3'],
  },
  {
    id: '5',
    title: 'ESP32 as a Security Research Platform',
    event: 'Makers Festival Delhi',
    type: 'demo',
    date: '2025-07-12',
    location: 'Delhi, India',
    is_online: false,
    description: 'Interactive demo booth showcasing the full C1ph3r Fsociety product lineup. Explained how ESP32 can be used as a versatile security research platform across BLE, WiFi, and RF.',
    has_video: false,
    has_slides: false,
    tags: ['ESP32', 'Demo', 'Education', 'Makers'],
  },
]

const TYPE_CONFIG = {
  conference: { variant: 'cyan' as const },
  workshop:   { variant: 'purple' as const },
  webinar:    { variant: 'info' as const },
  podcast:    { variant: 'success' as const },
  demo:       { variant: 'warning' as const },
}

export default function SpeakingPage() {
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
                { value: '5+', label: 'Events' },
                { value: '3', label: 'Workshop Topics' },
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
          <div className="space-y-6">
            {EVENTS.map(event => {
              const typeCfg = TYPE_CONFIG[event.type as keyof typeof TYPE_CONFIG]
              return (
                <div key={event.id} className="glow-card p-7">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={typeCfg.variant}>{event.type}</Badge>
                        {event.is_online && <Badge variant="info">Online</Badge>}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-brand-400 font-medium mb-3">{event.event}</p>
                      <p className="text-slate-400 leading-relaxed mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <span key={tag} className="tech-badge">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-48 flex flex-col gap-3 md:text-right">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 md:justify-end">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 md:justify-end">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 md:justify-end mt-2">
                        {event.has_video && (
                          <button className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                            <Video className="w-4 h-4" />
                            Video
                          </button>
                        )}
                        {event.has_slides && (
                          <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                            <FileText className="w-4 h-4" />
                            Slides
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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
                icon: <Mic className="w-5 h-5" />,
                format: ['Talk', 'Workshop'],
              },
              {
                title: 'Building Security Hardware',
                desc: 'From schematic to shipped product. KiCad, ESP32, PlatformIO, and lessons from running a hardware startup.',
                icon: <Mic className="w-5 h-5" />,
                format: ['Talk', 'Workshop'],
              },
              {
                title: 'Red Team Tools & Methodology',
                desc: 'Hands-on offensive security tooling for authorized engagements. Legal, ethical, and practical.',
                icon: <Mic className="w-5 h-5" />,
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
