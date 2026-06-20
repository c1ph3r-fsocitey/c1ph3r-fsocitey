import Link from 'next/link'
import { ArrowRight, Radio, Wifi, Bluetooth, FlaskConical, Cpu, BookOpen, Layers } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { ResearchProject } from '@/types'

const STATUS_BADGE: Record<string, { variant: 'cyan' | 'warning' | 'success'; label: string }> = {
  published: { variant: 'success', label: 'Published' },
  ongoing:   { variant: 'warning', label: 'Ongoing' },
  completed: { variant: 'cyan',    label: 'Completed' },
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'ble-security':     <Bluetooth className="w-6 h-6" />,
  'wifi-security':    <Wifi className="w-6 h-6" />,
  'rf-research':      <Radio className="w-6 h-6" />,
  'embedded-systems': <Cpu className="w-6 h-6" />,
  'robotics':         <Layers className="w-6 h-6" />,
  'educational':      <BookOpen className="w-6 h-6" />,
}

export default function ResearchHighlights({ projects }: { projects: ResearchProject[] }) {
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

        {projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Research projects coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(project => {
              const statusCfg = STATUS_BADGE[project.status] ?? { variant: 'info' as const, label: project.status }
              const icon = CATEGORY_ICONS[project.category] ?? <FlaskConical className="w-6 h-6" />
              return (
                <div key={project.slug} className="glow-card p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-400">
                      {icon}
                    </div>
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                  </div>
                  <span className="section-eyebrow text-xs mb-2">{project.category.replace(/-/g, ' ')}</span>
                  <h3 className="font-bold text-white mb-2 leading-snug">{project.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">{project.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="tech-badge">{tag}</span>
                    ))}
                  </div>
                  <Link href={`/research/${project.slug}`}
                    className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                    Read More →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
