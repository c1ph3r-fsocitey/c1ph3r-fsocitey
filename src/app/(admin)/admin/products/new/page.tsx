'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const CATEGORIES = ['ble-tools', 'wifi-tools', 'rf-tools', 'multi-tools', 'educational', 'accessories']

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', tagline: '', description: '', long_description: '',
    price: '', price_inr: '', compare_at_price: '',
    category: 'ble-tools', stock: '', sku: '',
    weight_grams: '', legal_disclaimer: '', is_active: true, is_featured: false,
  })
  const [tags,     setTags]     = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [images,   setImages]   = useState<string[]>([])
  const [newTag,     setNewTag]     = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newImage,   setNewImage]   = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

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
      const { error } = await supabase.from('products').insert({
        ...form,
        price:            parseFloat(form.price),
        price_inr:        form.price_inr        ? parseFloat(form.price_inr)        : null,
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        stock:            parseInt(form.stock),
        weight_grams:     form.weight_grams     ? parseInt(form.weight_grams)       : null,
        tags, features, images,
      })
      if (error) throw error
      toast.success('Product created!')
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">New Product</h1>
        </div>
        <Button isLoading={saving} onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Create Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glow-card p-6 space-y-4">
            <h2 className="font-bold text-white">Basic Info</h2>
            <Input label="Product Name" required value={form.name}
              onChange={e => { update('name')(e); setForm(f => ({ ...f, slug: autoSlug(e.target.value) })) }} />
            <Input label="Slug (URL)" required value={form.slug} onChange={update('slug')} helpText="e.g. disruptorx-v2" />
            <Input label="Tagline" value={form.tagline} onChange={update('tagline')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Short Description <span className="text-brand-400">*</span></label>
              <textarea value={form.description} onChange={update('description')} rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Full Description</label>
              <textarea value={form.long_description} onChange={update('long_description')} rows={5}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none" />
            </div>
          </div>

          {/* Features */}
          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Key Features</h2>
            <div className="flex gap-2">
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature('') }}}
                placeholder="Add a feature and press Enter"
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              <button onClick={() => { if (newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature('') }}}
                className="px-3 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {features.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-700 border border-brand-subtle">
                <span className="text-sm text-slate-300">{f}</span>
                <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Images</h2>
            <div className="flex gap-2">
              <input value={newImage} onChange={e => setNewImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              <button onClick={() => { if (newImage.trim()) { setImages([...images, newImage.trim()]); setNewImage('') }}}
                className="px-3 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700 border border-brand-subtle">
                <span className="text-xs text-slate-400 truncate flex-1 font-mono">{img}</span>
                <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glow-card p-6 space-y-4">
            <h2 className="font-bold text-white">Pricing & Stock</h2>
            <Input label="Price (USD)" required value={form.price} onChange={update('price')} placeholder="59.99" />
            <Input label="Price (INR)" value={form.price_inr} onChange={update('price_inr')} placeholder="5039" />
            <Input label="Compare At" value={form.compare_at_price} onChange={update('compare_at_price')} />
            <Input label="Stock" required value={form.stock} onChange={update('stock')} placeholder="10" />
            <Input label="SKU" required value={form.sku} onChange={update('sku')} placeholder="CF-XX-001" />
            <Input label="Weight (g)" value={form.weight_grams} onChange={update('weight_grams')} />
          </div>

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
                  onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag('') }}}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
                <button onClick={() => { if (newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag('') }}}
                  className="px-2 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-500/10 border border-brand-500/25 text-brand-300">
                    {tag}
                    <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glow-card p-6 space-y-3">
            <h2 className="font-bold text-white">Status</h2>
            {[
              { key: 'is_active',   label: 'Active (visible in store)' },
              { key: 'is_featured', label: 'Featured on homepage' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors ${(form as any)[key] ? 'bg-brand-500' : 'bg-surface-600'}`}
                  onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform ${(form as any)[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
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
