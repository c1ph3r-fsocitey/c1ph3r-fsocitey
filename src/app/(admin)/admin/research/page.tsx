'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, FlaskConical, Github, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { ResearchProject } from '@/types'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'cyan'> = {
  published: 'success',
  ongoing:   'warning',
  completed: 'cyan',
}

export default function AdminResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('research_projects')
        .select('*')
        .order('created_at', { ascending: false })
      setProjects(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Research & Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/research/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Project</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <FlaskConical className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No projects yet.</p>
          <Link href="/admin/research/new" className="mt-4 inline-block">
            <Button size="sm" variant="ghost">Add your first project →</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <div key={project.id} className="glow-card p-5 flex items-start gap-4 hover:border-brand-500/30 transition-colors">
              {/* Thumbnail */}
              {project.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-brand-subtle"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-6 h-6 text-slate-600" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white leading-snug">{project.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5 capitalize">{project.category.replace(/-/g, ' ')}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[project.status] ?? 'info'} className="capitalize flex-shrink-0">
                    {project.status}
                  </Badge>
                </div>
                <p className="text-slate-500 text-xs mt-1.5 line-clamp-1">{project.summary}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span>{formatDate(project.created_at)}</span>
                  {project.tags?.slice(0, 3).map(t => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/research/${project.id}`}>
                  <button className="p-2 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                <Link href={`/research/${project.slug}`} target="_blank">
                  <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
