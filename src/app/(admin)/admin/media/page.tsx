'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Link2, Image as ImageIcon, Play, Search, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { MediaItem, MediaCategory } from '@/types'

const CATEGORIES: MediaCategory[] = ['conference', 'workshop', 'product', 'research', 'demo', 'misc']

const CATEGORY_BADGE: Record<MediaCategory, 'cyan' | 'purple' | 'success' | 'info' | 'warning' | 'error'> = {
  conference: 'cyan',
  workshop:   'purple',
  product:    'success',
  research:   'info',
  demo:       'warning',
  misc:       'error',
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<MediaCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  // Add URL form
  const [showAddUrl, setShowAddUrl] = useState(false)
  const [urlForm, setUrlForm] = useState({ title: '', url: '', type: 'image' as 'image' | 'video', category: 'misc' as MediaCategory, description: '', tags: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(item => {
    const matchCat = filter === 'all' || item.category === filter
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAddUrl = async () => {
    if (!urlForm.url || !urlForm.title) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('media').insert({
      title: urlForm.title,
      url: urlForm.url,
      type: urlForm.type,
      category: urlForm.category,
      description: urlForm.description || null,
      tags: urlForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    })
    setSaving(false)
    if (!error) {
      setUrlForm({ title: '', url: '', type: 'image', category: 'misc', description: '', tags: '' })
      setShowAddUrl(false)
      load()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return
    const supabase = createClient()
    await supabase.from('media').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} items?`)) return
    const supabase = createClient()
    await supabase.from('media').delete().in('id', selected)
    setItems(prev => prev.filter(i => !selected.includes(i.id)))
    setSelected([])
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media</h1>
          <p className="text-slate-500 text-sm">{items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleBulkDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              Delete {selected.length}
            </Button>
          )}
          <Button size="sm" onClick={() => setShowAddUrl(v => !v)} leftIcon={<Link2 className="w-4 h-4" />}>
            Add URL
          </Button>
        </div>
      </div>

      {/* Add URL panel */}
      {showAddUrl && (
        <div className="glow-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Add Media by URL</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Title</label>
              <input value={urlForm.title} onChange={e => setUrlForm(p => ({...p, title: e.target.value}))}
                placeholder="Media title"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">URL</label>
              <input value={urlForm.url} onChange={e => setUrlForm(p => ({...p, url: e.target.value}))}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Type</label>
              <select value={urlForm.type} onChange={e => setUrlForm(p => ({...p, type: e.target.value as 'image' | 'video'}))}
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                <option value="image">Image</option>
                <option value="video">Video (YouTube)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category</label>
              <select value={urlForm.category} onChange={e => setUrlForm(p => ({...p, category: e.target.value as MediaCategory}))}
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Tags (comma-separated)</label>
              <input value={urlForm.tags} onChange={e => setUrlForm(p => ({...p, tags: e.target.value}))}
                placeholder="tag1, tag2"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Description</label>
              <input value={urlForm.description} onChange={e => setUrlForm(p => ({...p, description: e.target.value}))}
                placeholder="Optional description"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowAddUrl(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddUrl} disabled={saving || !urlForm.url || !urlForm.title}>
              {saving ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search media..."
            className="pl-9 pr-4 py-2 rounded-xl text-sm bg-surface-800 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-48" />
        </div>
        <div className="flex items-center gap-1 bg-surface-800 border border-brand-subtle rounded-xl p-1">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === 'all' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-500 hover:text-slate-300'}`}>All</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === cat ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-500 hover:text-slate-300'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading media...</div>
      ) : filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No media items yet. Add images or YouTube videos above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => {
            const isSelected = selected.includes(item.id)
            return (
              <div key={item.id}
                className={`relative group rounded-xl overflow-hidden border transition-all cursor-pointer ${isSelected ? 'border-brand-500' : 'border-brand-subtle hover:border-brand-500/40'}`}
                onClick={() => toggleSelect(item.id)}
              >
                <div className="aspect-square bg-surface-700 relative">
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-600">
                      <Play className="w-8 h-8 text-brand-400" />
                      <span className="text-xs text-slate-400">YouTube</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  )}

                  {/* Selection overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                    <button onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                      className="p-1.5 rounded-lg bg-red-900/80 text-red-400 hover:bg-red-800 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <p className="text-xs text-slate-300 truncate font-medium">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant={CATEGORY_BADGE[item.category] ?? 'cyan'} className="text-[10px] px-1.5 py-0">{item.category}</Badge>
                    <span className="text-[10px] text-slate-600">{formatDate(item.created_at, 'MMM d')}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
