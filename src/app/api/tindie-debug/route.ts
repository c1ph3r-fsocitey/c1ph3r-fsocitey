import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Temporary diagnostic endpoint — DELETE after debugging
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const service = createServiceClient()
  const { data: { user } } = await service.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const username = process.env.TINDIE_USERNAME ?? '(not set)'
  const apiKey   = process.env.TINDIE_API_KEY   ?? '(not set)'

  // Try query-param auth
  const url = `https://www.tindie.com/api/v1/order/?format=json&username=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&limit=1`

  let status = 0
  let body   = ''
  try {
    const res = await fetch(url, { cache: 'no-store' })
    status = res.status
    body   = await res.text()
  } catch (e: any) {
    body = e.message
  }

  return NextResponse.json({
    username_set:      username !== '(not set)',
    username_length:   username.length,
    username_preview:  username.slice(0, 3) + '...' + username.slice(-3),
    api_key_set:       apiKey !== '(not set)',
    api_key_length:    apiKey.length,
    api_key_last6:     apiKey.slice(-6),
    tindie_status:     status,
    tindie_body_first300: body.slice(0, 300),
  })
}
