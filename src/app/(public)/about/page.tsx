import type { Metadata } from 'next'
import { Github, Instagram, ExternalLink, Cpu, Radio, Zap, BookOpen, Shield, Award } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Rahul Thareja',
  description:
    'Robotics Engineer by profession, hardware hacker by passion. Founder of C1ph3r Fsociety — building offensive security hardware from scratch in Delhi, India.',
}

const SKILLS = [
  { category: 'Hardware', items: ['ESP32 / ESP8266', 'PCB Design (KiCad)', 'Embedded C/C++', 'RF Circuits', 'BLE Stack', 'Soldering & Assembly'] },
  { category: 'Software', items: ['Arduino / PlatformIO', 'Python', 'JavaScript / TypeScript', 'Linux / Kali', 'Git', 'Firmware OTA'] },
  { category: 'Security', items: ['BLE Pentesting', 'WiFi Security', 'RF Signal Analysis', 'Red Team Tools', 'Signal Jamming', 'Protocol Reverse Engineering'] },
  { category: 'Other', items: ['Robotics (ROS)', '3D Printing', 'CNC', 'Workshop Facilitation', 'Technical Writing'] },
]

const TIMELINE = [
  { year: '2024', title: 'C1ph3r Fsociety Founded', desc: 'Started designing and building offensive security hardware tools in Delhi.' },
  { year: '2025', title: 'First Products Shipped', desc: 'Launched on Tindie — DisruptorX, RF Annihilator, WiFi BLE Pentest Pro.' },
  { year: '2025', title: '63+ Orders Worldwide', desc: 'Shipped hardware to security researchers, red teamers, and educators worldwide.' },
  { year: '2026', title: 'Expanded Product Line', desc: 'Spectrum Slayer HellSpawn, Marauder OG, DisruptorX V2 and more.' },
]

export default function AboutPage() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-4">About the Founder</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Rahul Thareja
              </h1>
              <p className="text-brand-400 text-xl font-medium mb-6">
                Robotics Engineer · Hardware Hacker · Security Researcher
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                I&apos;m a Robotics Engineer by profession and hardware hacker by passion,
                based in Delhi, India. I founded C1ph3r Fsociety to design and build
                offensive security tools from scratch — entirely self-funded from my day job.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Every device you see in the store has been designed by me, PCB laid out by me,
                assembled by me, tested by me, and shipped by me. There are no resellers
                or Alibaba sourcing here — only original hardware built with purpose.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/c1ph3r.fsocitey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700 border border-brand-subtle text-sm text-slate-300 hover:text-brand-400 hover:border-brand-medium transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
                <a
                  href="https://github.com/c1ph3r-fsocitey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700 border border-brand-subtle text-sm text-slate-300 hover:text-brand-400 hover:border-brand-medium transition-all"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <Link href="/contact">
                  <Button variant="primary">Contact Me</Button>
                </Link>
              </div>
            </div>

            {/* Profile card */}
            <div className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto">
              <div className="rounded-2xl overflow-hidden border border-brand-medium bg-surface-800 aspect-[3/4] flex flex-col items-center justify-center gap-6 relative">
                <div className="absolute inset-0 bg-hero-gradient" />
                <div className="relative z-10 text-center px-8">
                  <div className="w-28 h-28 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto mb-6">
                    <Cpu className="w-14 h-14 text-brand-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Rahul Thareja</h2>
                  <p className="text-brand-400 mt-1">Founder, C1ph3r Fsociety</p>
                  <p className="text-slate-500 text-sm mt-2">Delhi, India · Est. 2024</p>
                  <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                    <div>
                      <div className="text-xl font-bold gradient-text">9+</div>
                      <div className="text-xs text-slate-500">Products</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold gradient-text">63+</div>
                      <div className="text-xs text-slate-500">Orders</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold gradient-text">5.0★</div>
                      <div className="text-xs text-slate-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <p className="section-eyebrow mb-4 text-center">The Story</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
            How C1ph3r Fsociety Was Born
          </h2>
          <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
            <p>
              Like a lot of hardware hackers, it started with a problem: I wanted to do
              hands-on wireless security research, but the commercially available tools were
              either too expensive, closed-source, or frankly not very interesting to work with.
            </p>
            <p>
              So I started building my own. First for personal use — a BLE jammer to understand
              how Bluetooth disruption actually worked at the firmware level. Then I got into RF.
              Then WiFi deauthentication. Before long I had a workbench full of custom hardware
              that I&apos;d built from scratch.
            </p>
            <p>
              Friends started asking where to get them. I put the first batch on Tindie in
              June 2025, fully expecting maybe five orders. Within weeks I had shipped dozens,
              with customers from Europe, the Middle East, and Southeast Asia. The demand
              confirmed what I suspected: there&apos;s a real market for honest, well-documented
              security hardware.
            </p>
            <p>
              C1ph3r Fsociety is still a one-person operation. I design, assemble, test, and
              ship every unit myself. That won&apos;t scale forever — but it means every customer
              is getting something made with actual care and attention.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding bg-surface-800/30">
        <div className="section-container">
          <p className="section-eyebrow mb-4 text-center">Technical Skills</p>
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map(skill => (
              <div key={skill.category} className="glow-card p-6">
                <h3 className="font-bold text-brand-400 mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="section-container max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4 text-center">Journey</p>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Timeline</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-brand-subtle" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex gap-6 pl-16">
                  <div className="absolute left-0 w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-medium flex items-center justify-center text-brand-400 font-mono text-xs font-bold">
                    {item.year}
                  </div>
                  <div className="glow-card p-5 flex-1">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-brand-subtle">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Collaborate?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Available for speaking engagements, workshops, consulting, and wholesale inquiries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact?type=speaking"><Button>Book a Talk</Button></Link>
            <Link href="/contact?type=business"><Button variant="secondary">Business Inquiry</Button></Link>
            <Link href="/store"><Button variant="ghost">Shop Hardware</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
