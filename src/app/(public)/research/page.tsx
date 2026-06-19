import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, FlaskConical, Radio, Wifi, Bluetooth, Cpu, BookOpen, Layers } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/server'
import type { ResearchProject, ResearchCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Research & Projects',
  description: 'Security research projects by C1ph3r Fsociety — BLE vulnerabilities, WiFi deauth, RF signal analysis, and embedded systems.',
}

const STATUS_CONFIG: Record<string, { variant: 'success' | 'warning' | 'cyan'; label: string }> = {
  published: { variant: 'success', label: 'Published' },
  ongoing:   { variant: 'warning', label: 'Ongoing' },
  completed: { variant: 'cyan',    label: 'Completed' },
}

const CATEGORY_ICONS: Record<ResearchCategory, React.ReactNode> = {
  'ble-security':     <Bluetooth className="w-6 h-6" />,
  'wifi-security':    <Wifi className="w-6 h-6" />,
  'rf-research':      <Radio className="w-6 h-6" />,
  'embedded-systems': <Cpu className="w-6 h-6" />,
  'robotics':         <Layers className="w-6 h-6" />,
  'educational':      <BookOpen className="w-6 h-6" />,
}

export default async function ResearchPage() {
  const supabase = createClient()
  const { data: projects } = await supabase
    .from('research_projects')
    .select('*')
    .order('published_at', { ascending: false })

  const allProjects: ResearchProject[] = projects ?? []

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
          {allProjects.length === 0 ? (
            <div className="glow-card p-12 text-center">
              <FlaskConical className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No research projects yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allProjects.map(project => {
                const statusCfg = STATUS_CONFIG[project.status] ?? { variant: 'info' as const, label: project.status }
                const icon = CATEGORY_ICONS[project.category] ?? <FlaskConical className="w-6 h-6" />
                return (
                  <div key={project.slug} className="glow-card p-7 flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-400">
                        {icon}
                      </div>
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    </div>

                    <span className="section-eyebrow text-xs mb-2">{project.category.replace(/-/g, ' ')}</span>
                    <Link href={`/research/${project.slug}`}>
                      <h2 className="text-xl font-bold text-white mb-3 hover:text-brand-400 transition-colors cursor-pointer">
                        {project.title}
                      </h2>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags?.map(tag => (
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
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
