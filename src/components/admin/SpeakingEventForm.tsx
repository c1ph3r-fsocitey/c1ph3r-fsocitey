'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { SpeakingEvent } from '@/types'

interface Props {
  initialData?: SpeakingEvent
}

const EMPTY: Partial<SpeakingEvent> = {
  title: '',
  event_name: '',
  event_type: 'conference',
  date: '',
  location: '',
  is_online: false,
  description: '',
  video_url: '',
  slides_url: '',
  event_url: '',
  cover_image: '',
  tags: [],
}

export default function SpeakingEventForm({ initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Partial<SpeakingEvent>>(initialData ?? EMPTY)
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!initialData
  const set = (key: keyof SpeakingEvent, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setError('')
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    }
    let result
    if (isEdit) {
      result = await supabase.from('speaking_events').update(payload).eq('id', initialData.id)
    } else {
      result = await supabase.from('speaking_events').insert({ ...payload, created_at: new Date().toISOString() })
    }
    setSaving(false)
    if (result.error) setError(result.error.message)
    else router.push('/admin/speaking')
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!confirm('Delete this event?')) return
    const supabase = createClient()
    await supabase.from('speaking_events').delete().eq('id', initialData.id)
    router.push('/admin/speaking')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/speaking">
            <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Event' : 'Add Event'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button onClick={handleDelete}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
            {saving ? 'Saving...' : 'Save Event'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glow-card p-6 space-y-4">
            <Field label="Talk / Workshop Title">
              <input value={form.title ?? ''} onChange={e => set('title', e.target.value)}
                placeholder="Your talk or workshop title" className={INPUT} />
            </Field>
            <Field label="Event Name">
              <input value={form.event_name ?? ''} onChange={e => set('event_name', e.target.value)}
                placeholder="e.g. DEF CON 32, BSides Bangalore" className={INPUT} />
            </Field>
            <Field label="Description">
              <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Describe the talk, key topics covered..."
                className={INPUT + ' resize-none'} />
            </Field>
          </div>

          <div className="glow-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Links</h3>
            <Field label="Event URL">
              <input value={form.event_url ?? ''} onChange={e => set('event_url', e.target.value)}
                placeholder="https://..." className={INPUT} />
            </Field>
            <Field label="Video / Recording URL">
              <input value={form.video_url ?? ''} onChange={e => set('video_url', e.target.value)}
                placeholder="https://youtube.com/..." className={INPUT} />
            </Field>
            <Field label="Slides URL">
              <input value={form.slides_url ?? ''} onChange={e => set('slides_url', e.target.value)}
                placeholder="https://..." className={INPUT} />
            </Field>
            <Field label="Cover Image URL">
              <input value={form.cover_image ?? ''} onChange={e => set('cover_image', e.target.value)}
                placeholder="https://..." className={INPUT} />
            </Field>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glow-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Event Details</h3>

            <Field label="Date">
              <input type="date" value={form.date ?? ''} onChange={e => set('date', e.target.value)} className={INPUT} />
            </Field>

            <Field label="Type">
              <select value={form.event_type ?? 'conference'} onChange={e => set('event_type', e.target.value as SpeakingEvent['event_type'])} className={INPUT}>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="podcast">Podcast</option>
                <option value="demo">Demo</option>
              </select>
            </Field>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Online Event</span>
              <button onClick={() => set('is_online', !form.is_online)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_online ? 'bg-brand-500' : 'bg-surface-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_online ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {!form.is_online && (
              <Field label="Location">
                <input value={form.location ?? ''} onChange={e => set('location', e.target.value)}
                  placeholder="City, Country" className={INPUT} />
              </Field>
            )}

            <Field label="Tags (comma-separated)">
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="ble, rf, hardware..." className={INPUT} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

const INPUT = 'w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
