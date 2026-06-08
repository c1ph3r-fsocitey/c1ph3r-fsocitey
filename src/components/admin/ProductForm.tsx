'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { Save, Trash2, Plus, X } from 'lucide-react'

const CATEGORIES = [
  { value: 'ble-tools',   label: 'BLE Tools' },
  { value: 'wifi-tools',  label: 'WiFi Tools' },
  { value: 'rf-tools',    label: 'RF Tools' },
  { value: 'multi-tools', label: 'Multi-Tools' },
  { value: 'educational', label: 'Educational' },
  { value: 'accessories', label: 'Accessories' },
]

interface ProductFormProps {
  product?: any
  isNew?: boolean
}

export default function ProductForm({ product, isNew = false }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    name:              product?.name              ?? '',
    slug:              product?.slug              ?? '',
    tagline:           product?.tagline           ?? '',
    description:       product?.description       ?? '',
    long_description:  product?.long_description  ?? '',
    price:             product?.price             ?? '',
    price_inr:         product?.price_inr         ?? '',
    compare_at_price:  product?.compare_at_price  ?? '',
    stock:             product?.stock             ?? '',
    sku:               product?.sku               ?? '',
    weight_grams:      product?.weight_grams      ?? '',
    category:          product?.category          ?? 'ble-tools',
    legal_disclaimer:  product?.legal_disclaimer  ?? '',
    is_active:         product?.is_active         ?? true,
    is_featured:       product?.is_featured       ?? false,
  })

  const [tags,     setTags]     = useState<string[]>(product?.tags     ?? [])
  const [features, setFeatures] = useState<string[]>(product?.features ?? [])
  const [images,   setImages]   = useState<string[]>(product?.images   ?? [])
  const [newTag,     setNewTag]     = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newImage,   setNewImage]   = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const toggle = (field: string) =>
    setForm(f => ({ ...f, [field]: !f[field as keyof typeof f] }))

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.price || !form.stock || !form.sku) {
      toast.error('Name, slug, price, stock and SKU are required')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        ...form,
        price:           parseFloat(form.price),
        price_inr:       form.price_inr       ? parseFloat(form.price_inr)      : null,
        compare_at_price:form.compare_at_price? parseFloat(form.compare_at_price): null,
        stock:           parseInt(form.stock),
        weight_grams:    form.weight_grams    ? parseInt(form.weight_grams)     : null,
        tags,
        features,
        images,
        updated_at: new Date().toISOString(),
      }

      if (isNew) {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Product created!')
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id)
        if (error) throw error
        toast.success('Product saved!')
      }
      router.push('/admin/products')
      router.refresh()
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
      const { error } = await supabase.from('products').delete().eq('id', product.id)
      if (error) throw error
      toast.success('Product deleted')
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? 'New Product' : `Edit: ${product?.name}`}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isNew ? 'Add a new product to the store' : 'Update product details, stock, and status'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Button variant="danger" isLoading={deleting} onClick={handleDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete
            </Button>
          )}
          <Button isLoading={saving} onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}>
            {isNew ? 'Create Product' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="glow-card p-6 space-y-5">
        <h2 className="font-bold text-white">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Product Name" required value={form.name}
            onChange={e => { update('name')(e); setForm(f => ({ ...f, slug: autoSlug(e.target.value) })) }} />
          <Input label="Slug (URL)" required value={form.slug} onChange={update('slug')}
            helpText="e.g. disruptorx-v2 — used in the product URL" />
        </div>
        <Input label="Tagline" required value={form.tagline} onChange={update('tagline')}
          placeholder="Short one-line description" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Short Description <span className="text-brand-400">*</span></label>
          <textarea value={form.description} onChange={update('description')} rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Long Description</label>
          <textarea value={form.long_description} onChange={update('long_description')} rows={6}
            placeholder="Full product description with all details..."
            className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Legal Disclaimer</label>
          <textarea value={form.legal_disclaimer} onChange={update('legal_disclaimer')} rows={2}
            placeholder="For authorized testing only..."
            className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none" />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="glow-card p-6 space-y-5">
        <h2 className="font-bold text-white">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="Price (USD)" required type="number" step="0.01" value={form.price} onChange={update('price')} placeholder="59.99" />
          <Input label="Price (INR)" type="number" value={form.price_inr} onChange={update('price_inr')} placeholder="5039" />
          <Input label="Compare At (USD)" type="number" step="0.01" value={form.compare_at_price} onChange={update('compare_at_price')} placeholder="79.99" />
          <Input label="Stock" required type="number" value={form.stock} onChange={update('stock')} placeholder="10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="SKU" required value={form.sku} onChange={update('sku')} placeholder="CF-DX-001" />
          <Input label="Weight (grams)" type="number" value={form.weight_grams} onChange={update('weight_grams')} placeholder="50" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Category</label>
            <select value={form.category} onChange={update('category')}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="glow-card p-6">
        <h2 className="font-bold text-white mb-4">Status</h2>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => toggle('is_active')}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-brand-500' : 'bg-surface-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-slate-300">Active (visible in store)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => toggle('is_featured')}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_featured ? 'bg-brand-500' : 'bg-surface-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-slate-300">Featured (shown on homepage)</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="glow-card p-6">
        <h2 className="font-bold text-white mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-brand-500/10 border border-brand-500/25 text-brand-300">
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newTag} onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag('') }}}
            placeholder="Add tag and press Enter"
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <Button variant="secondary" onClick={() => { if (newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag('') }}}
            leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
        </div>
      </div>

      {/* Features */}
      <div className="glow-card p-6">
        <h2 className="font-bold text-white mb-4">Key Features</h2>
        <div className="space-y-2 mb-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-surface-700 border border-brand-subtle">
              <span className="text-sm text-slate-300 flex-1">{f}</span>
              <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature('') }}}
            placeholder="Add feature and press Enter"
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <Button variant="secondary" onClick={() => { if (newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature('') }}}
            leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
        </div>
      </div>

      {/* Images */}
      <div className="glow-card p-6">
        <h2 className="font-bold text-white mb-2">Product Images</h2>
        <p className="text-slate-500 text-xs mb-4">Paste image URLs. Full image upload coming soon.</p>
        <div className="space-y-2 mb-3">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-surface-700 border border-brand-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
              <span className="text-xs text-slate-400 flex-1 truncate font-mono">{img}</span>
              <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newImage} onChange={e => setNewImage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newImage.trim()) { setImages([...images, newImage.trim()]); setNewImage('') }}}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <Button variant="secondary" onClick={() => { if (newImage.trim()) { setImages([...images, newImage.trim()]); setNewImage('') }}}
            leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
        </div>
      </div>

      {/* Save button at bottom too */}
      <div className="flex items-center justify-between pb-8">
        <Button variant="ghost" onClick={() => router.push('/admin/products')}>
          ← Back to Products
        </Button>
        <Button isLoading={saving} onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          {isNew ? 'Create Product' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
