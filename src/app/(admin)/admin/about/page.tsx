'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Plus, Trash2, Upload, X, Loader2, Link2, GripVertical } from 'lucide-react'
import Button from '@/components/ui/Button'

interface SkillGroup  { category: string; items: string[] }
interface TimelineItem { year: string; title: string; desc: string }

interface AboutData {
  name: string
  tagline: string
  bio: string[]
  photo_url: string | null
  stat_products: string
  stat_orders: string
  stat_rating: string
  story: string[]
  skills: SkillGroup[]
  timeline: TimelineItem[]
}

const DEFAULTS: AboutData = {
  name: 'Rahul Thareja',
  tagline: 'Robotics Engineer · Hardware Hacker · Security Researcher',
  bio: [''],
  photo_url: null,
  stat_products: '9+',
  stat_orders: '63+',
  stat_rating: '5.0★',
  story: [''],
  skills: [{ category: 'Hardware', items: [''] }],
  timeline: [{ year: '', title: '', desc: '' }],
}

const INPUT    = 'w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
const TEXTAREA = INPUT + ' resize-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: row } = await supabase.from('about_page').select('*').single()
      if (row) {
        setData({
          name:          row.name          ?? DEFAULTS.name,
          tagline:       row.tagline       ?? DEFAULTS.tagline,
          bio:           row.bio?.length   ? row.bio   : [''],
          photo_url:     row.photo_url     ?? null,
          stat_products: row.stat_products ?? DEFAULTS.stat_products,
          stat_orders:   row.stat_orders   ?? DEFAULTS.stat_orders,
          stat_rating:   row.stat_rating   ?? DEFAULTS.stat_rating,
          story:         row.story?.length ? row.story : [''],
          skills:        row.skills?.length ? row.skills : DEFAULTS.skills,
          timeline:      row.timeline?.length ? row.timeline : DEFAULTS.timeline,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const set = <K extends keyof AboutData>(key: K, value: AboutData[K]) =>
    setData(prev => ({ ...prev, [key]: value }))

  // ── Array helpers ─────────────────────────────────────────────────────────
  const setParagraph = (key: 'bio' | 'story', i: number, val: string) =>
    set(key, data[key].map((p, idx) => idx === i ? val : p))

  const addParagraph = (key: 'bio' | 'story') =>
    set(key, [...data[key], ''])

  const removeParagraph = (key: 'bio' | 'story', i: number) =>
    set(key, data[key].filter((_, idx) => idx !== i))

  // ── Skills ────────────────────────────────────────────────────────────────
  const setSkillCategory = (gi: number, val: string) =>
    set('skills', data.skills.map((g, i) => i === gi ? { ...g, category: val } : g))

  const setSkillItem = (gi: number, ii: number, val: string) =>
    set('skills', data.skills.map((g, i) => i === gi
      ? { ...g, items: g.items.map((item, j) => j === ii ? val : item) }
      : g
    ))

  const addSkillItem = (gi: number) =>
    set('skills', data.skills.map((g, i) => i === gi ? { ...g, items: [...g.items, ''] } : g))

  const removeSkillItem = (gi: number, ii: number) =>
    set('skills', data.skills.map((g, i) => i === gi
      ? { ...g, items: g.items.filter((_, j) => j !== ii) }
      : g
    ))

  const addSkillGroup = () =>
    set('skills', [...data.skills, { category: '', items: [''] }])

  const removeSkillGroup = (gi: number) =>
    set('skills', data.skills.filter((_, i) => i !== gi))

  // ── Timeline ──────────────────────────────────────────────────────────────
  const setTimeline = (i: number, field: keyof TimelineItem, val: string) =>
    set('timeline', data.timeline.map((t, idx) => idx === i ? { ...t, [field]: val } : t))

  const addTimelineItem = () =>
    set('timeline', [...data.timeline, { year: '', title: '', desc: '' }])

  const removeTimelineItem = (i: number) =>
    set('timeline', data.timeline.filter((_, idx) => idx !== i))

  // ── Photo upload ──────────────────────────────────────────────────────────
  const uploadPhoto = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).')
      return
    }
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'about')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) {
        setError(`Upload failed: ${json.error}`)
      } else {
        setData(prev => ({ ...prev, photo_url: json.url }))
      }
    } catch (e) {
      setError('Upload failed: network error.')
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadPhoto(file)
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError('')
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...data,
      skills:   data.skills.map(g => ({ ...g, items: g.items.filter(Boolean) })),
      bio:      data.bio.filter(Boolean),
      story:    data.story.filter(Boolean),
      updated_at: new Date().toISOString(),
    }
    const { error: err } = await supabase
      .from('about_page')
      .upsert({ id: 1, ...payload })
    setSaving(false)
    if (err) setError(err.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">About Page</h1>
          <p className="text-slate-500 text-sm mt-1">Edit the public about/founder page.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      <Section title="Profile">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field label="Name">
              <input value={data.name} onChange={e => set('name', e.target.value)} className={INPUT} />
            </Field>
            <Field label="Tagline / Title">
              <input value={data.tagline} onChange={e => set('tagline', e.target.value)} className={INPUT} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Products stat">
                <input value={data.stat_products} onChange={e => set('stat_products', e.target.value)} className={INPUT} placeholder="9+" />
              </Field>
              <Field label="Orders stat">
                <input value={data.stat_orders} onChange={e => set('stat_orders', e.target.value)} className={INPUT} placeholder="63+" />
              </Field>
              <Field label="Rating stat">
                <input value={data.stat_rating} onChange={e => set('stat_rating', e.target.value)} className={INPUT} placeholder="5.0★" />
              </Field>
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Profile Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]) }} />

            {data.photo_url ? (
              <div className="relative group rounded-xl overflow-hidden border border-brand-subtle aspect-[3/4] max-w-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-brand-500/80 text-white text-xs hover:bg-brand-500 transition-colors">
                    Replace
                  </button>
                  <button onClick={() => set('photo_url', null)}
                    className="p-1.5 rounded-lg bg-red-900/80 text-red-400 hover:bg-red-800 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-brand-subtle hover:border-brand-500/50'
                }`}
              >
                {uploading
                  ? <div className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 text-brand-400 animate-spin" /><span className="text-xs text-slate-400">Uploading...</span></div>
                  : <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-slate-500" />
                      <p className="text-xs text-slate-400">Drop photo or <span className="text-brand-400">click to browse</span></p>
                    </div>
                }
              </div>
            )}

            <button onClick={() => setShowUrlInput(v => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-2 transition-colors">
              <Link2 className="w-3 h-3" /> Or enter photo URL
            </button>
            {showUrlInput && (
              <div className="flex gap-2 mt-2">
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://..." className={INPUT + ' flex-1'} />
                <Button size="sm" onClick={() => { set('photo_url', urlInput); setUrlInput(''); setShowUrlInput(false) }}>
                  Set
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-400">Hero Bio (paragraphs)</label>
            <button onClick={() => addParagraph('bio')}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
              <Plus className="w-3 h-3" /> Add paragraph
            </button>
          </div>
          {data.bio.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={p} onChange={e => setParagraph('bio', i, e.target.value)}
                rows={3} placeholder={`Paragraph ${i + 1}`} className={TEXTAREA + ' flex-1'} />
              {data.bio.length > 1 && (
                <button onClick={() => removeParagraph('bio', i)}
                  className="p-2 text-slate-600 hover:text-red-400 transition-colors self-start mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Story ───────────────────────────────────────────────────────── */}
      <Section title="Story Section">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500">Paragraphs under "How C1ph3r Fsociety Was Born"</p>
            <button onClick={() => addParagraph('story')}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
              <Plus className="w-3 h-3" /> Add paragraph
            </button>
          </div>
          {data.story.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={p} onChange={e => setParagraph('story', i, e.target.value)}
                rows={4} placeholder={`Paragraph ${i + 1}`} className={TEXTAREA + ' flex-1'} />
              {data.story.length > 1 && (
                <button onClick={() => removeParagraph('story', i)}
                  className="p-2 text-slate-600 hover:text-red-400 transition-colors self-start mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      <Section title="Skills">
        <div className="space-y-5">
          {data.skills.map((group, gi) => (
            <div key={gi} className="p-4 rounded-xl bg-surface-700/50 border border-brand-subtle space-y-3">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <input value={group.category}
                  onChange={e => setSkillCategory(gi, e.target.value)}
                  placeholder="Category name (e.g. Hardware)"
                  className={INPUT + ' flex-1'} />
                <button onClick={() => removeSkillGroup(gi)}
                  className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="pl-7 space-y-2">
                {group.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2">
                    <input value={item}
                      onChange={e => setSkillItem(gi, ii, e.target.value)}
                      placeholder="Skill item"
                      className={INPUT + ' flex-1'} />
                    {group.items.length > 1 && (
                      <button onClick={() => removeSkillItem(gi, ii)}
                        className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addSkillItem(gi)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-400 transition-colors mt-1">
                  <Plus className="w-3 h-3" /> Add skill
                </button>
              </div>
            </div>
          ))}
          <button onClick={addSkillGroup}
            className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors">
            <Plus className="w-4 h-4" /> Add skill category
          </button>
        </div>
      </Section>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <Section title="Timeline">
        <div className="space-y-4">
          {data.timeline.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-700/50 border border-brand-subtle">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <input value={item.year} onChange={e => setTimeline(i, 'year', e.target.value)}
                  placeholder="Year" className={INPUT} />
                <input value={item.title} onChange={e => setTimeline(i, 'title', e.target.value)}
                  placeholder="Title" className={INPUT + ' col-span-3'} />
              </div>
              <div className="flex gap-2">
                <textarea value={item.desc} onChange={e => setTimeline(i, 'desc', e.target.value)}
                  rows={2} placeholder="Description" className={TEXTAREA + ' flex-1'} />
                {data.timeline.length > 1 && (
                  <button onClick={() => removeTimelineItem(i)}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors self-start">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addTimelineItem}
            className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors">
            <Plus className="w-4 h-4" /> Add timeline entry
          </button>
        </div>
      </Section>

      {/* Sticky save */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glow-card p-6 space-y-5">
      <h2 className="text-base font-semibold text-white border-b border-brand-subtle pb-3">{title}</h2>
      {children}
    </div>
  )
}
