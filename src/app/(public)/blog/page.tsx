import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Security research, hardware tutorials, and technical write-ups from C1ph3r Fsociety.',
}

export default async function BlogPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const allPosts: BlogPost[] = posts ?? []

  return (
    <div className="bg-grid">
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-3xl mx-auto">
          <p className="section-eyebrow mb-4">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Research, Tutorials &{' '}
            <span className="gradient-text">Technical Write-ups</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Deep dives into security hardware, firmware development, and wireless protocol research.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          {allPosts.length === 0 ? (
            <div className="glow-card p-12 text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No posts yet — check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <div className="glow-card p-7">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {post.categories?.map(cat => (
                            <Badge key={cat} variant="cyan">{cat}</Badge>
                          ))}
                          {post.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="tech-badge">{tag}</span>
                          ))}
                        </div>

                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          {post.published_at && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.published_at)}
                            </span>
                          )}
                          {post.reading_time && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {post.reading_time} min read
                            </span>
                          )}
                          <span>{post.author}</span>
                        </div>
                      </div>

                      <div className="flex items-center md:items-end md:justify-end">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 group-hover:text-brand-300 transition-colors">
                          Read More
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
