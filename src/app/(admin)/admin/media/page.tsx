'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Link2, Image as ImageIcon, Play, Search, X, Loader2 } from 'lucide-react'
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

  // Upload state
  const [uploadMode, setUploadMode] = useState<'file' | 'url' | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload metadata
  const [uploadMeta, setUploadMeta] = useState<{ category: MediaCategory; tags: string }>({ category: 'misc', tags: '' })

  // URL form state
  const [urlForm, setUrlForm] = useState({ title: '', url: '', type: 'image' as 'image' | 'video', category: 'misc' as MediaCategory, description: '', tags: '' })
  const [savingUrl, setSavingUrl] = useState(false)

  const load = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('media_items').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(item => {
    const matchCat = filter === 'all' || item.category === filter
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // ── File upload ──────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (fileArray.length === 0) return

    setUploading(true)
    setUploadProgress([])
    const supabase = createClient()
    const tags = uploadMeta.tags.split(',').map(t => t.trim()).filter(Boolean)

    for (const file of fileArray) {
      setUploadProgress(prev => [...prev, `Uploading ${file.name}...`])
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data: storageData, error: storageErr } = await supabase.storage
        .from('media')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (storageErr) {
        setUploadProgress(prev => [...prev, `❌ ${file.name}: ${storageErr.message}`])
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

      const { error: dbErr } = await supabase.from('media_items').insert({
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        url: publicUrl,
        type: 'image',
        category: uploadMeta.category,
        tags,
        created_at: new Date().toISOString(),
      })

      if (dbErr) {
        setUploadProgress(prev => [...prev, `❌ DB error for ${file.name}: ${dbErr.message}`])
      } else {
        setUploadProgress(prev => [...prev.filter(p => p.includes(file.name)), `✓ ${file.name} uploaded`])
      }
    }

    setUploading(false)
    await load()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files)
  }, [uploadMeta])

  // ── URL add ──────────────────────────────────────────────────────────────
  const handleAddUrl = async () => {
    if (!urlForm.url || !urlForm.title) return
    setSavingUrl(true)
    const supabase = createClient()
    const { error } = await supabase.from('media_items').insert({
      title: urlForm.title,
      url: urlForm.url,
      type: urlForm.type,
      category: urlForm.category,
      description: urlForm.description || null,
      tags: urlForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    })
    setSavingUrl(false)
    if (!error) {
      setUrlForm({ title: '', url: '', type: 'image', category: 'misc', description: '', tags: '' })
      setUploadMode(null)
      load()
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Delete this media item?')) return
    const supabase = createClient()

    // Try to remove from storage if it's a Supabase storage URL
    const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`
    if (item.url.startsWith(storageBase)) {
      const path = item.url.replace(storageBase, '')
      await supabase.storage.from('media').remove([path])
    }

    await supabase.from('media_items').delete().eq('id', item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} items?`)) return
    const supabase = createClient()
    const toDelete = items.filter(i => selected.includes(i.id))
    const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`
    const storagePaths = toDelete
      .filter(i => i.url.startsWith(storageBase))
      .map(i => i.url.replace(storageBase, ''))
    if (storagePaths.length > 0) await supabase.storage.from('media').remove(storagePaths)
    await supabase.from('media_items').delete().in('id', selected)
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
          <Button size="sm" variant={uploadMode === 'url' ? 'secondary' : 'ghost'} onClick={() => setUploadMode(m => m === 'url' ? null : 'url')} leftIcon={<Link2 className="w-4 h-4" />}>
            Add URL
          </Button>
          <Button size="sm" onClick={() => setUploadMode(m => m === 'file' ? null : 'file')} leftIcon={<Upload className="w-4 h-4" />}>
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload panel */}
      {uploadMode === 'file' && (
        <div className="glow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">Upload Images</h3>
            <button onClick={() => setUploadMode(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
          </div>

          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category</label>
              <select value={uploadMeta.category} onChange={e => setUploadMeta(p => ({...p, category: e.target.value as MediaCategory}))}
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Tags (comma-separated)</label>
              <input value={uploadMeta.tags} onChange={e => setUploadMeta(p => ({...p, tags: e.target.value}))}
                placeholder="tag1, tag2"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-brand-subtle hover:border-brand-500/50 hover:bg-surface-700/50'
            }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                <p className="text-sm text-slate-400">Uploading...</p>
                <div className="text-xs text-slate-500 space-y-1">
                  {uploadProgress.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-8 h-8 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-300">Drop images here or click to browse</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP, GIF — multiple files supported</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress log after upload */}
          {!uploading && uploadProgress.length > 0 && (
            <div className="text-xs text-slate-500 space-y-1 bg-surface-700 rounded-lg p-3">
              {uploadProgress.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Add URL panel */}
      {uploadMode === 'url' && (
        <div className="glow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">Add Media by URL</h3>
            <button onClick={() => setUploadMode(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
          </div>
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
              <label className="block text-xs text-slate-400 mb-1.5">Tags</label>
              <input value={urlForm.tags} onChange={e => setUrlForm(p => ({...p, tags: e.target.value}))}
                placeholder="tag1, tag2"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Description</label>
              <input value={urlForm.description} onChange={e => setUrlForm(p => ({...p, description: e.target.value}))}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setUploadMode(null)}>Cancel</Button>
            <Button size="sm" onClick={handleAddUrl} disabled={savingUrl || !urlForm.url || !urlForm.title}>
              {savingUrl ? 'Adding...' : 'Add Item'}
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
        <div className="flex items-center gap-1 bg-surface-800 border border-brand-subtle rounded-xl p-1 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-500 hover:text-slate-300'}`}>All</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === cat ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-500 hover:text-slate-300'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-500 text-sm">Loading media...</div>
      ) : filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No media yet. Upload images or add by URL above.</p>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                    <button onClick={e => { e.stopPropagation(); handleDelete(item) }}
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
