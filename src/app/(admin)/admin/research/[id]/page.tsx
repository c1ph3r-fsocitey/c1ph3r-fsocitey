'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ResearchProjectForm from '@/components/admin/ResearchProjectForm'
import type { ResearchProject } from '@/types'

export default function EditResearchProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState<ResearchProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('research_projects')
        .select('*')
        .eq('id', id)
        .single()
      setProject(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-slate-500 text-sm">Loading project...</div>
  if (!project) return <div className="text-red-400 text-sm">Project not found.</div>

  return <ResearchProjectForm initialData={project} />
}
