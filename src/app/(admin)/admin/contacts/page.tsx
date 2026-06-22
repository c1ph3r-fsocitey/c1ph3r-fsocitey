'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, MessageSquare, Check, Trash2, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'

interface Submission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  inquiry_type: string
  is_read: boolean
  created_at: string
}

const TYPE_BADGE: Record<string, 'cyan' | 'purple' | 'info' | 'warning' | 'success'> = {
  general:   'info',
  business:  'cyan',
  speaking:  'purple',
  support:   'warning',
  wholesale: 'success',
}

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setSubmissions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return
    const supabase = createClient()
    await supabase.from('contact_submissions').delete().eq('id', id)
    setSubmissions(prev => prev.filter(s => s.id !== id))
    if (selected === id) setSelected(null)
  }

  const openSubmission = (sub: Submission) => {
    setSelected(sub.id)
    if (!sub.is_read) markRead(sub.id)
  }

  const unread = submissions.filter(s => !s.is_read).length
  const active = submissions.find(s => s.id === selected)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-slate-500 text-sm mt-1">
          {submissions.length} total · {unread} unread
        </p>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: '500px' }}>

          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {submissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => openSubmission(sub)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected === sub.id
                    ? 'bg-brand-500/10 border-brand-500/40'
                    : 'glow-card hover:border-brand-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!sub.is_read && (
                      <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm font-medium truncate ${sub.is_read ? 'text-slate-400' : 'text-white'}`}>
                      {sub.name}
                    </span>
                  </div>
                  <Badge variant={TYPE_BADGE[sub.inquiry_type] ?? 'info'} className="flex-shrink-0 capitalize text-[10px]">
                    {sub.inquiry_type}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 truncate pl-4">{sub.subject}</p>
                <p className="text-xs text-slate-600 pl-4 mt-0.5">{formatDate(sub.created_at)}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {active ? (
              <div className="glow-card p-6 space-y-5 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-white text-lg">{active.subject}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant={TYPE_BADGE[active.inquiry_type] ?? 'info'} className="capitalize">
                        {active.inquiry_type}
                      </Badge>
                      <span className="text-xs text-slate-500">{formatDate(active.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!active.is_read && (
                      <button
                        onClick={() => markRead(active.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-900/10 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(active.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-700/50 border border-brand-subtle">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 font-bold text-sm">{active.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{active.name}</p>
                    <a href={`mailto:${active.email}`} className="text-brand-400 text-xs hover:text-brand-300 transition-colors flex items-center gap-1">
                      {active.email}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <a
                    href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-medium hover:bg-brand-500/30 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-surface-700/30 border border-brand-subtle">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{active.message}</p>
                </div>
              </div>
            ) : (
              <div className="glow-card p-12 text-center h-full flex flex-col items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-slate-500 text-sm">Select a submission to read it</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
