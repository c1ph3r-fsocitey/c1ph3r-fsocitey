'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SpeakingEventForm from '@/components/admin/SpeakingEventForm'
import type { SpeakingEvent } from '@/types'

export default function EditSpeakingEventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<SpeakingEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('speaking_events').select('*').eq('id', id).single()
      setEvent(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-slate-500 text-sm">Loading event...</div>
  if (!event) return <div className="text-red-400 text-sm">Event not found.</div>

  return <SpeakingEventForm initialData={event} />
}
