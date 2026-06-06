import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendContactNotification } from '@/lib/email/contact'
import { z } from 'zod'

const schema = z.object({
  name:         z.string().min(2),
  email:        z.string().email(),
  inquiry_type: z.string(),
  subject:      z.string().min(5),
  message:      z.string().min(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase.from('contact_submissions').insert(parsed.data)
    if (error) {
      console.error('Contact DB error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    await sendContactNotification(parsed.data)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
