'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Eye, FileText, Tag, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { BlogPost } from '@/types'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      setPosts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = posts.filter(p => {
    if (filter === 'published') return p.is_published
    if (filter === 'draft') return !p.is_published
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-slate-500 text-sm">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Post</Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-surface-800 border border-brand-subtle rounded-xl p-1 w-fit">
        {(['all', 'published', 'draft'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === tab
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">
            {filter === 'all' ? 'No posts yet.' : `No ${filter} posts.`}
          </p>
          <Link href="/admin/blog/new" className="mt-4 inline-block">
            <Button size="sm" variant="ghost">Write your first post →</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <div key={post.id} className="glow-card p-5 flex items-start gap-4 hover:border-brand-500/30 transition-colors">
              {/* Cover thumbnail placeholder */}
              <div className="w-16 h-16 rounded-lg bg-surface-700 border border-brand-subtle flex-shrink-0 flex items-center justify-center overflow-hidden">
                {post.cover_image ? (
                  <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white leading-snug">{post.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={post.is_published ? 'success' : 'warning'}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  {post.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} min read
                    </span>
                  )}
                  {post.tags?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.tags.slice(0, 3).join(', ')}
                    </span>
                  )}
                  <span>
                    {post.is_published && post.published_at
                      ? `Published ${formatDate(post.published_at, 'MMM d, yyyy')}`
                      : `Created ${formatDate(post.created_at, 'MMM d, yyyy')}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/blog/${post.id}`}>
                  <button className="p-2 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                {post.is_published && (
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
