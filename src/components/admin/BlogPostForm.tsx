'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Eye, Trash2, Globe, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { BlogPost } from '@/types'

interface Props {
  initialData?: BlogPost
}

const EMPTY: Partial<BlogPost> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: 'Rahul Thareja',
  tags: [],
  categories: [],
  is_published: false,
  seo_title: '',
  seo_description: '',
  reading_time: undefined,
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogPostForm({ initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Partial<BlogPost>>(initialData ?? EMPTY)
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!initialData

  const set = (key: keyof BlogPost, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleTitleChange = (v: string) => {
    set('title', v)
    if (!isEdit) set('slug', slugify(v))
  }

  const handleSave = async (publish?: boolean) => {
    setError('')
    setSaving(true)

    const supabase = createClient()
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      is_published: publish !== undefined ? publish : form.is_published,
      published_at:
        publish === true && !form.published_at
          ? new Date().toISOString()
          : form.published_at,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEdit) {
      result = await supabase.from('blog_posts').update(payload).eq('id', initialData.id)
    } else {
      result = await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() })
    }

    setSaving(false)
    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/admin/blog')
    }
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('blog_posts').delete().eq('id', initialData.id)
    router.push('/admin/blog')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog">
            <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-slate-500 text-sm">{isEdit ? initialData.title : 'Write a new blog post'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {isEdit && form.is_published && (
            <Link href={`/blog/${form.slug}`} target="_blank">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-surface-700 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving}
            leftIcon={<Lock className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving}
            leftIcon={<Globe className="w-3.5 h-3.5" />}
          >
            {form.is_published ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glow-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Title</label>
              <input
                value={form.title ?? ''}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Slug</label>
              <input
                value={form.slug ?? ''}
                onChange={e => set('slug', e.target.value)}
                placeholder="post-url-slug"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Excerpt</label>
              <textarea
                value={form.excerpt ?? ''}
                onChange={e => set('excerpt', e.target.value)}
                rows={2}
                placeholder="Short summary shown in listings..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Content (Markdown)</label>
              <textarea
                value={form.content ?? ''}
                onChange={e => set('content', e.target.value)}
                rows={20}
                placeholder="Write your post in Markdown..."
                className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-y font-mono"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="glow-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">SEO</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">SEO Title</label>
              <input
                value={form.seo_title ?? ''}
                onChange={e => set('seo_title', e.target.value)}
                placeholder="Custom title for search engines..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Meta Description</label>
              <textarea
                value={form.seo_description ?? ''}
                onChange={e => set('seo_description', e.target.value)}
                rows={2}
                placeholder="160-character meta description..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="glow-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Post Details</h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Author</label>
              <input
                value={form.author ?? ''}
                onChange={e => set('author', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Cover Image URL</label>
              <input
                value={form.cover_image ?? ''}
                onChange={e => set('cover_image', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              {form.cover_image && (
                <img src={form.cover_image} alt="" className="mt-2 rounded-lg w-full h-24 object-cover" />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Tags (comma-separated)</label>
              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="ble, hacking, rf..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Reading Time (min)</label>
              <input
                type="number"
                value={form.reading_time ?? ''}
                onChange={e => set('reading_time', Number(e.target.value) || undefined)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-brand-subtle">
              <span className="text-sm text-slate-400">Published</span>
              <button
                onClick={() => set('is_published', !form.is_published)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.is_published ? 'bg-brand-500' : 'bg-surface-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.is_published ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
