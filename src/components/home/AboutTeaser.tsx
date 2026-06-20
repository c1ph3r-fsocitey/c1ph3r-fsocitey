import Link from 'next/link'
import { ArrowRight, Cpu, Zap, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AboutData {
  name?: string
  bio?: string[]
  photo_url?: string | null
}

export default function AboutTeaser({ about }: { about: AboutData | null }) {
  const name    = about?.name ?? 'Rahul Thareja'
  const bio     = about?.bio  ?? []
  const photo   = about?.photo_url ?? null

  // Show first two bio paragraphs, or fallback copy
  const para1 = bio[0] ?? `Hey, I'm ${name} — a Robotics Engineer from Delhi, India. C1ph3r Fsociety started as a passion project: I wanted to design and build offensive security tools from scratch, entirely self-funded from my day job.`
  const para2 = bio[1] ?? 'Every product in this store is designed, soldered, tested, and shipped by me. Open-source firmware, honest documentation, and real hardware — not resold Alibaba modules.'

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-eyebrow mb-4">About the Founder</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Robotics Engineer by Day.{' '}
              <span className="gradient-text">Hardware Hacker by Night.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">{para1}</p>
            <p className="text-slate-400 leading-relaxed mb-8">{para2}</p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Cpu className="w-5 h-5" />,      label: 'Hardware Designer' },
                { icon: <Zap className="w-5 h-5" />,      label: 'Embedded Systems' },
                { icon: <BookOpen className="w-5 h-5" />, label: 'Educator' },
              ].map(item => (
                <div key={item.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-800 border border-brand-subtle text-center">
                  <span className="text-brand-400">{item.icon}</span>
                  <span className="text-xs font-medium text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Read My Story
              </Button>
            </Link>
          </div>

          {/* Photo / placeholder */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-brand-subtle bg-surface-800 aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-800 to-surface-900">
                  <div className="w-24 h-24 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                    <Cpu className="w-12 h-12 text-brand-400" />
                  </div>
                  <div className="text-center px-8">
                    <p className="text-white font-bold text-xl">{name}</p>
                    <p className="text-brand-400 text-sm mt-1">Founder, C1ph3r Fsociety</p>
                    <p className="text-slate-500 text-xs mt-1">Delhi, India</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
