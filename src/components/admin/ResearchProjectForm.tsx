'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2, Upload, X, Loader2, Link2, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { ResearchProject, ResearchCategory } from '@/types'

const CATEGORIES: { value: ResearchCategory; label: string }[] = [
  { value: 'ble-security',     label: 'BLE Security' },
  { value: 'wifi-security',    label: 'WiFi Security' },
  { value: 'rf-research',      label: 'RF Research' },
  { value: 'embedded-systems', label: 'Embedded Systems' },
  { value: 'robotics',         label: 'Robotics' },
  { value: 'educational',      label: 'Educational' },
]

const STATUSES = [
  { value: 'ongoing',   label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'published', label: 'Published' },
]

const EMPTY: Partial<ResearchProject> = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  images: [],
  video_url: '',
  github_url: '',
  tags: [],
  category: 'ble-security',
  status: 'ongoing',
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface Props {
  initialData?: ResearchProject
}

export default function ResearchProjectForm({ initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Partial<ResearchProject>>(initialData ?? EMPTY)
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!initialData
  const set = (key: keyof ResearchProject, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleTitleChange = (value: string) => {
    set('title', value)
    if (!isEdit || !form.slug) set('slug', slugify(value))
  }

  const handleSave = async () => {
    setError('')
    if (!form.title || !form.slug || !form.summary) {
      setError('Title, slug, and summary are required.')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      images: form.images ?? [],
    }
    let result
    if (isEdit) {
      result = await supabase.from('research_projects').update(payload).eq('id', initialData.id)
    } else {
      result = await supabase.from('research_projects').insert({
        ...payload,
        created_at: new Date().toISOString(),
      })
    }
    setSaving(false)
    if (result.error) setError(result.error.message)
    else router.push('/admin/research')
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!confirm('Delete this project?')) return
    const supabase = createClient()
    await supabase.from('research_projects').delete().eq('id', initialData.id)
    router.push('/admin/research')
  }

  // ── Image upload ──────────────────────────────────────────────────────────
  const uploadImages = useCallback(async (files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'))
    if (!images.length) return
    setUploading(true)
    const uploaded: string[] = []

    for (const file of images) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'research')
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (res.ok) uploaded.push(json.url)
      } catch {}
    }

    set('images', [...(form.images ?? []), ...uploaded])
    setUploading(false)
  }, [form.images])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    uploadImages(Array.from(e.dataTransfer.files))
  }, [uploadImages])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadImages(Array.from(e.target.files))
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    set('images', [...(form.images ?? []), url])
    setUrlInput('')
    setShowUrlInput(false)
  }

  const removeImage = (index: number) => {
    set('images', (form.images ?? []).filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/research">
            <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Project' : 'Add Project'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button onClick={handleDelete}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glow-card p-6 space-y-4">
            <Field label="Project Title">
              <input
                value={form.title ?? ''}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. BLE Attack Surface Analysis on Consumer IoT"
                className={INPUT}
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.slug ?? ''}
                onChange={e => set('slug', slugify(e.target.value))}
                placeholder="ble-attack-surface-analysis"
                className={INPUT}
              />
            </Field>
            <Field label="Summary (one-liner shown on cards)">
              <textarea
                value={form.summary ?? ''}
                onChange={e => set('summary', e.target.value)}
                rows={2}
                placeholder="Brief summary shown in the research listing..."
                className={INPUT + ' resize-none'}
              />
            </Field>
            <Field label="Full Description / Write-up">
              <textarea
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
                rows={10}
                placeholder="Full research write-up, methodology, findings..."
                className={INPUT + ' resize-none'}
              />
            </Field>
          </div>

          {/* Images */}
          <div className="glow-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Project Images</h3>

            {/* Existing images */}
            {(form.images ?? []).length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {(form.images ?? []).map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-surface-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(i)}
                        className="p-1.5 rounded-lg bg-red-900/80 text-red-400 hover:bg-red-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                dragOver
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-brand-subtle hover:border-brand-500/50 hover:bg-surface-700/50'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
                  <span className="text-sm text-slate-400">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-slate-500" />
                  <p className="text-xs text-slate-400">
                    Drop images here or <span className="text-brand-400">click to browse</span>
                  </p>
                  <p className="text-[10px] text-slate-600">Multiple files supported · PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            {/* URL fallback */}
            <div>
              <button
                type="button"
                onClick={() => setShowUrlInput(v => !v)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Link2 className="w-3 h-3" />
                Or add image by URL
              </button>
              {showUrlInput && (
                <div className="flex gap-2 mt-2">
                  <input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addUrl()}
                    placeholder="https://..."
                    className={INPUT + ' flex-1'}
                  />
                  <Button size="sm" onClick={addUrl} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: metadata */}
        <div className="space-y-5">
          <div className="glow-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Details</h3>

            <Field label="Category">
              <select
                value={form.category ?? 'ble-security'}
                onChange={e => set('category', e.target.value as ResearchCategory)}
                className={INPUT}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                value={form.status ?? 'ongoing'}
                onChange={e => set('status', e.target.value as ResearchProject['status'])}
                className={INPUT}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Published Date">
              <input
                type="date"
                value={form.published_at ? form.published_at.slice(0, 10) : ''}
                onChange={e => set('published_at', e.target.value || undefined)}
                className={INPUT}
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="BLE, ESP32, IoT..."
                className={INPUT}
              />
            </Field>
          </div>

          <div className="glow-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Links</h3>
            <Field label="GitHub URL">
              <input
                value={form.github_url ?? ''}
                onChange={e => set('github_url', e.target.value)}
                placeholder="https://github.com/..."
                className={INPUT}
              />
            </Field>
            <Field label="Video / Demo URL">
              <input
                value={form.video_url ?? ''}
                onChange={e => set('video_url', e.target.value)}
                placeholder="https://youtube.com/..."
                className={INPUT}
              />
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
