'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BlogPostForm from '@/components/admin/BlogPostForm'
import type { BlogPost } from '@/types'

export default function EditBlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single()
      setPost(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-slate-500 text-sm">Loading post...</div>
  if (!post) return <div className="text-red-400 text-sm">Post not found.</div>

  return <BlogPostForm initialData={post} />
}
