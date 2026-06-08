'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const CATEGORIES = ['ble-tools', 'wifi-tools', 'rf-tools', 'multi-tools', 'educational', 'accessories']

export default function ProductEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    name: '', slug: '', tagline: '', description: '', long_description: '',
    price: '', price_inr: '', compare_at_price: '',
    category: 'ble-tools', tags: [] as string[], stock: '', sku: '',
    weight_grams: '', legal_disclaimer: '', is_active: true, is_featured: false,
    images: [] as string[], features: [] as string[],
  })

  const [newTag, setNewTag] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newImage, setNewImage] = useState('')

  useEffect(() => {
    if (isNew) return
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          tagline: data.tagline ?? '',
          description: data.description ?? '',
          long_description: data.long_description ?? '',
          price: String(data.price ?? ''),
          price_inr: String(data.price_inr ?? ''),
          compare_at_price: String(data.compare_at_price ?? ''),
          category: data.category ?? 'ble-tools',
          tags: data.tags ?? [],
          stock: String(data.stock ?? ''),
          sku: data.sku ?? '',
          weight_grams: String(data.weight_grams ?? ''),
          legal_disclaimer: data.legal_disclaimer ?? '',
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
          images: data.images ?? [],
          features: data.features ?? [],
        })
      }
      setLoading(false)
    }
    fetch()
  }, [id, isNew])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.price) {
      toast.error('Name, slug, and price are required')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        name: form.name, slug: form.slug, tagline: form.tagline,
        description: form.description, long_description: form.long_description,
        price: parseFloat(form.price),
        price_inr: form.price_inr ? parseFloat(form.price_inr) : null,
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        category: form.category, tags: form.tags,
        stock: parseInt(form.stock) || 0,
        sku: form.sku,
        weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
        legal_disclaimer: form.legal_disclaimer,
        is_active: form.is_active, is_featured: form.is_featured,
        images: form.images, features: form.features,
      }

      if (isNew) {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Product created!')
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', id)
        if (error) throw error
        toast.success('Product saved!')
      }
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('products').delete().eq('id', id)
      toast.success('Product deleted')
      router.push('/admin/products')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-slate-500 p-8">Loading...</div>

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{isNew ? 'New Product' : 'Edit Product'}</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}>Delete</Button>
          )}
          <Button isLoading={saving} onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            {isNew ? 'Create Product' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glow-card p-6 space-y-4">
            <h2 className="font-bold text-white">Basic Info</h2>
            <Input label="Product Name" required value={form.name} onChange={update('name')} />
            <Input label="Slug (URL)" required value={form.slug} onChange={update('slug')} helpText="e.g. disruptorx-v2" />
            <Input label="Tagline" value={form.tagline} onChange={update('tagline')} helpText="Short one-liner shown under name" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Short Description <span className="text-brand-400">*</span></label>
              <textarea value={form.description} onChange={update('description')} rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Full Description</label>
              <textarea value={form.long_description} onChange={update('long_description')} rows={6}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none" />
            </div>
          </div>

          {/* Features */}
          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Key Features</h2>
            <div className="flex gap-2">
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newFeature.trim()) { setForm(f => ({ ...f, features: [...f.features, newFeature.trim()] })); setNewFeature('') }}}
                placeholder="Add a feature and press Enter"
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              <button onClick={() => { if (newFeature.trim()) { setForm(f => ({ ...f, features: [...f.features, newFeature.trim()] })); setNewFeature('') }}}
                className="px-3 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-700 border border-brand-subtle">
                  <span className="text-sm text-slate-300">{f}</span>
                  <button onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }))}
                    className="text-slate-600 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Images</h2>
            <p className="text-xs text-slate-500">Paste image URLs (from Supabase Storage, Tindie, or any CDN)</p>
            <div className="flex gap-2">
              <input value={newImage} onChange={e => setNewImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              <button onClick={() => { if (newImage.trim()) { setForm(f => ({ ...f, images: [...f.images, newImage.trim()] })); setNewImage('') }}}
                className="px-3 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-700 border border-brand-subtle gap-3">
                  <span className="text-xs text-slate-400 truncate flex-1">{img}</span>
                  <button onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }))}
                    className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="glow-card p-6">
            <h2 className="font-bold text-white mb-3">Legal Disclaimer</h2>
            <textarea value={form.legal_disclaimer} onChange={update('legal_disclaimer')} rows={3}
              placeholder="For authorized testing only..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <div className="glow-card p-6 space-y-4">
            <h2 className="font-bold text-white">Pricing & Stock</h2>
            <Input label="Price (USD)" required value={form.price} onChange={update('price')} placeholder="59.99" />
            <Input label="Price (INR)" value={form.price_inr} onChange={update('price_inr')} placeholder="5039" />
            <Input label="Compare At Price" value={form.compare_at_price} onChange={update('compare_at_price')} helpText="Shows as strikethrough" />
            <Input label="Stock Quantity" value={form.stock} onChange={update('stock')} placeholder="10" />
            <Input label="SKU" value={form.sku} onChange={update('sku')} placeholder="CF-DX-001" />
            <Input label="Weight (grams)" value={form.weight_grams} onChange={update('weight_grams')} placeholder="150" />
          </div>

          {/* Category & Tags */}
          <div className="glow-card p-6 space-y-4">
            <h2 className="font-bold text-white">Category & Tags</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <select value={form.category} onChange={update('category')}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input value={newTag} onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setForm(f => ({ ...f, tags: [...f.tags, newTag.trim()] })); setNewTag('') }}}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
                <button onClick={() => { if (newTag.trim()) { setForm(f => ({ ...f, tags: [...f.tags, newTag.trim()] })); setNewTag('') }}}
                  className="px-2 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-brand-500/10 border border-brand-500/25 text-brand-300">
                    {tag}
                    <button onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter((_, j) => j !== i) }))}
                      className="hover:text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Status</h2>
            {[
              { key: 'is_active',   label: 'Active (visible in store)' },
              { key: 'is_featured', label: 'Featured (shown on homepage)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors ${(form as any)[key] ? 'bg-brand-500' : 'bg-surface-600'}`}
                  onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform ${(form as any)[key] ? 'translate-x-4.5 ml-0.5' : 'ml-0.5'}`} />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
