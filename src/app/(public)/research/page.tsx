import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, ExternalLink, Radio, Wifi, Bluetooth, Cpu, BookOpen } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Research & Projects',
  description: 'Security research projects by C1ph3r Fsociety — BLE vulnerabilities, WiFi deauth, RF signal analysis, and embedded systems.',
}

const PROJECTS = [
  {
    slug: 'ble-attack-surface',
    title: 'BLE Attack Surface Analysis on Consumer IoT',
    category: 'BLE Security',
    status: 'published',
    icon: <Bluetooth className="w-6 h-6" />,
    tags: ['BLE', 'ESP32', 'IoT', 'Jammer'],
    summary: 'Comprehensive cataloguing of BLE vulnerabilities across 20+ consumer IoT devices. Covers MITM, jamming, spoofing, and the Sour Apple vulnerability.',
    description: 'This research systematically tests BLE security across smart locks, fitness trackers, and IoT sensors. We document attack vectors, reproduce known CVEs, and demonstrate novel jamming and spoofing techniques using the DisruptorX platform.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
  {
    slug: '5ghz-deauth-research',
    title: '5GHz Deauthentication: Modern Network Weaknesses',
    category: 'WiFi Security',
    status: 'ongoing',
    icon: <Wifi className="w-6 h-6" />,
    tags: ['WiFi 5GHz', 'Deauth', '802.11', 'Enterprise'],
    summary: 'Investigating the persistence of deauthentication vulnerabilities in 5GHz Wi-Fi networks, including WPA3 implementations and enterprise configurations.',
    description: 'While 802.11w Management Frame Protection is widely available, deployment is inconsistent. This research surveys real-world enterprise networks and documents the gap between specification and implementation.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
  {
    slug: 'ism-band-replay',
    title: 'ISM Band Replay Attacks: 315/433MHz Vulnerabilities',
    category: 'RF Research',
    status: 'published',
    icon: <Radio className="w-6 h-6" />,
    tags: ['RF', '315MHz', '433MHz', 'Replay'],
    summary: 'A systematic review of replay attack vulnerabilities in ISM band devices: garage doors, key fobs, wireless sensors, and legacy access control systems.',
    description: 'Using the RF Annihilator platform, we captured and analyzed signals from 50+ consumer RF devices. This paper documents signal modulation patterns, replay window sizes, and recommendations for hardening legacy RF systems.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
  {
    slug: 'ghostesp-extensions',
    title: 'GhostESP Firmware Extensions for Advanced Recon',
    category: 'Embedded Systems',
    status: 'completed',
    icon: <Cpu className="w-6 h-6" />,
    tags: ['GhostESP', 'ESP32', 'Firmware', 'Open Source'],
    summary: 'Custom extensions to the GhostESP framework adding automated SSID cataloguing, BLE device fingerprinting, and PCAP export for offline analysis.',
    description: 'Building on the open-source GhostESP project, these extensions add capabilities specifically useful for authorized red team engagements: automated target profiling, stealth modes, and integration with common reporting frameworks.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
  {
    slug: 'wardriving-gps-integration',
    title: 'GPS-Integrated Wardriving with Marauder',
    category: 'WiFi Security',
    status: 'published',
    icon: <Wifi className="w-6 h-6" />,
    tags: ['GPS', 'Wardriving', 'Marauder', 'Mapping'],
    summary: 'Methodology and tooling for GPS-integrated WiFi/BLE wardriving using the Marauder OG platform. Includes PCAP + GPS correlation and WiGLE integration.',
    description: 'The Marauder OG platform adds a GPS module to the classic ESP32 Marauder, enabling geolocation-tagged packet capture. This write-up covers field methodology, data processing pipelines, and ethical considerations for wardriving research.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
  {
    slug: 'hardware-design-workflow',
    title: 'Designing Offensive Security Hardware: A Practical Guide',
    category: 'Educational',
    status: 'published',
    icon: <BookOpen className="w-6 h-6" />,
    tags: ['KiCad', 'PCB Design', 'ESP32', 'Tutorial'],
    summary: 'End-to-end walkthrough of designing a security research tool: schematic capture in KiCad, PCB layout, prototype fabrication, firmware, and production.',
    description: 'A practical guide to going from idea to shipped hardware product. Covers schematic design, PCB layout rules for RF circuits, ordering prototypes from JLCPCB, firmware development in PlatformIO, and quality control.',
    github: 'https://github.com/c1ph3r-fsocitey',
  },
]

const STATUS_CONFIG = {
  published: { variant: 'success' as const, label: 'Published' },
  ongoing:   { variant: 'warning' as const, label: 'Ongoing' },
  completed: { variant: 'cyan' as const,    label: 'Completed' },
}

export default function ResearchPage() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">Research & Projects</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Security Research &{' '}
            <span className="gradient-text">Open Findings</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Every product we build is grounded in real security research.
            Here are the investigations, published papers, and open-source projects
            driving C1ph3r Fsociety&apos;s hardware roadmap.
          </p>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map(project => {
              const statusCfg = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]
              return (
                <div key={project.slug} className="glow-card p-7 flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-400">
                      {project.icon}
                    </div>
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                  </div>

                  <span className="section-eyebrow text-xs mb-2">{project.category}</span>
                  <Link href={`/research/${project.slug}`}>
                    <h2 className="text-xl font-bold text-white mb-3 hover:text-brand-400 transition-colors cursor-pointer">
                      {project.title}
                    </h2>
                  </Link>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map(tag => (
                      <span key={tag} className="tech-badge">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/research/${project.slug}`}
                      className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      Read More →
                    </Link>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
