import Link from 'next/link'
import { ArrowRight, Cpu, Zap, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AboutTeaser() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <p className="section-eyebrow mb-4">About the Founder</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Robotics Engineer by Day.{' '}
              <span className="gradient-text">Hardware Hacker by Night.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Hey, I&apos;m Rahul Thareja — a Robotics Engineer from Delhi, India.
              C1ph3r Fsociety started as a passion project: I wanted to design and build
              offensive security tools from scratch, entirely self-funded from my day job.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Every product in this store is designed, soldered, tested, and shipped by me.
              Open-source firmware, honest documentation, and real hardware — not resold
              Alibaba modules.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Cpu className="w-5 h-5" />, label: 'Hardware Designer' },
                { icon: <Zap className="w-5 h-5" />, label: 'Embedded Systems' },
                { icon: <BookOpen className="w-5 h-5" />, label: 'Educator' },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-800 border border-brand-subtle text-center"
                >
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

          {/* Visual side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-brand-subtle bg-surface-800 aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto">
              {/* Placeholder — replace with Rahul's photo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-800 to-surface-900">
                <div className="w-24 h-24 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                  <Cpu className="w-12 h-12 text-brand-400" />
                </div>
                <div className="text-center px-8">
                  <p className="text-white font-bold text-xl">Rahul Thareja</p>
                  <p className="text-brand-400 text-sm mt-1">Founder, C1ph3r Fsociety</p>
                  <p className="text-slate-500 text-xs mt-2">Delhi, India · Est. 2024</p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-500/5 rounded-tr-3xl" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-surface-700 border border-brand-medium shadow-glow">
              <div className="text-2xl font-bold gradient-text">63+</div>
              <div className="text-xs text-slate-400">Happy customers worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
