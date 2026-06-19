import type { Metadata } from 'next'
import { Github, Instagram, Cpu } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'About Rahul Thareja',
  description:
    'Robotics Engineer by profession, hardware hacker by passion. Founder of C1ph3r Fsociety — building offensive security hardware from scratch in Delhi, India.',
}

interface SkillGroup  { category: string; items: string[] }
interface TimelineItem { year: string; title: string; desc: string }

export default async function AboutPage() {
  const supabase = createClient()
  const { data: about } = await supabase.from('about_page').select('*').single()

  const name          = about?.name          ?? 'Rahul Thareja'
  const tagline       = about?.tagline       ?? 'Robotics Engineer · Hardware Hacker · Security Researcher'
  const bio: string[] = about?.bio           ?? []
  const photoUrl      = about?.photo_url     ?? null
  const statProducts  = about?.stat_products ?? '9+'
  const statOrders    = about?.stat_orders   ?? '63+'
  const statRating    = about?.stat_rating   ?? '5.0★'
  const story: string[]         = about?.story    ?? []
  const skills: SkillGroup[]    = about?.skills   ?? []
  const timeline: TimelineItem[] = about?.timeline ?? []

  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-4">About the Founder</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{name}</h1>
              <p className="text-brand-400 text-xl font-medium mb-6">{tagline}</p>
              {bio.map((p, i) => (
                <p key={i} className="text-slate-400 leading-relaxed mb-4">{p}</p>
              ))}
              <div className="flex items-center gap-3 mt-4">
                <a href="https://instagram.com/c1ph3r.fsocitey/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700 border border-brand-subtle text-sm text-slate-300 hover:text-brand-400 hover:border-brand-medium transition-all">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
                <a href="https://github.com/c1ph3r-fsocitey" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700 border border-brand-subtle text-sm text-slate-300 hover:text-brand-400 hover:border-brand-medium transition-all">
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
              <div className="rounded-2xl overflow-hidden border border-brand-medium bg-surface-800 aspect-[3/4] flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-hero-gradient" />
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={name} className="w-full h-full object-cover relative z-10" />
                ) : (
                  <div className="relative z-10 text-center px-8">
                    <div className="w-28 h-28 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto mb-6">
                      <Cpu className="w-14 h-14 text-brand-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{name}</h2>
                    <p className="text-brand-400 mt-1">Founder, C1ph3r Fsociety</p>
                    <p className="text-slate-500 text-sm mt-2">Delhi, India · Est. 2024</p>
                  </div>
                )}

                {/* Stats overlay */}
                <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${photoUrl ? 'bg-gradient-to-t from-surface-900/90 via-surface-900/60 to-transparent' : ''}`}>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { value: statProducts, label: 'Products' },
                      { value: statOrders,   label: 'Orders' },
                      { value: statRating,   label: 'Rating' },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="text-xl font-bold gradient-text">{s.value}</div>
                        <div className="text-xs text-slate-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      {story.length > 0 && (
        <section className="section-padding">
          <div className="section-container max-w-4xl mx-auto">
            <p className="section-eyebrow mb-4 text-center">The Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
              How C1ph3r Fsociety Was Born
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              {story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="section-padding bg-surface-800/30">
          <div className="section-container">
            <p className="section-eyebrow mb-4 text-center">Technical Skills</p>
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map(skill => (
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
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="section-padding">
          <div className="section-container max-w-3xl mx-auto">
            <p className="section-eyebrow mb-4 text-center">Journey</p>
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Timeline</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-brand-subtle" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
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
      )}

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
