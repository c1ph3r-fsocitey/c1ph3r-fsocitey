import Link from 'next/link'
import { ArrowRight, Radio, Wifi, Bluetooth, FlaskConical } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const RESEARCH = [
  {
    icon: <Bluetooth className="w-6 h-6" />,
    category: 'BLE Security',
    title: 'BLE Attack Surface Analysis',
    summary:
      'Comprehensive analysis of BLE vulnerabilities: MITM, jamming, spoofing, and Sour Apple exploitation across consumer IoT devices.',
    tags: ['BLE', 'ESP32', 'IoT'],
    status: 'published',
    slug: 'ble-attack-surface',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    category: 'WiFi Security',
    title: '5GHz Deauthentication Research',
    summary:
      'Investigating 5GHz Wi-Fi deauthentication vulnerabilities — what enterprise networks get wrong, and how to test for compliance.',
    tags: ['WiFi 5GHz', 'Deauth', 'Enterprise'],
    status: 'ongoing',
    slug: '5ghz-deauth-research',
  },
  {
    icon: <Radio className="w-6 h-6" />,
    category: 'RF Research',
    title: 'ISM Band Signal Replay Attacks',
    summary:
      'Cataloguing replay attack vectors in 315/433MHz ISM band devices: garage doors, sensors, and legacy access control systems.',
    tags: ['RF', '433MHz', 'Replay'],
    status: 'published',
    slug: 'ism-band-replay',
  },
]

const STATUS_BADGE: Record<string, { variant: 'cyan' | 'warning' | 'success'; label: string }> = {
  published: { variant: 'success', label: 'Published' },
  ongoing:   { variant: 'warning', label: 'Ongoing' },
  completed: { variant: 'cyan',    label: 'Completed' },
}

export default function ResearchHighlights() {
  return (
    <section className="section-padding bg-surface-800/30 bg-grid">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="section-eyebrow mb-3">Research & Projects</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What We&apos;re{' '}
              <span className="gradient-text">Investigating</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl text-balance">
              Security research drives every product we build. Here are some of the
              active investigations and published findings.
            </p>
          </div>
          <Link href="/research">
            <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              All Research
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESEARCH.map(r => {
            const s = STATUS_BADGE[r.status]
            return (
              <Link key={r.slug} href={`/research/${r.slug}`} className="group">
                <div className="glow-card h-full p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-400">
                      {r.icon}
                    </div>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>

                  <span className="section-eyebrow text-xs mb-2">{r.category}</span>
                  <h3 className="font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
                    {r.summary}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {r.tags.map(tag => (
                      <span key={tag} className="tech-badge">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
