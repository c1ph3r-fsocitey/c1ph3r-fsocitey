import { NextResponse } from 'next/server'

// Temporary diagnostic — DELETE after debugging
export async function GET() {
  const apiKey = process.env.TINDIE_API_KEY ?? ''

  if (!apiKey) {
    return NextResponse.json({ error: 'TINDIE_API_KEY not set' })
  }

  // Try every plausible username format
  const candidates = [
    process.env.TINDIE_USERNAME ?? '',   // whatever is currently set
    'C1PH3R_FSOCITEY',                   // uppercase profile username
    'c1ph3r_fsocitey',                   // lowercase store slug
    'rahulthegreat2001@gmail.com',        // email
    'C1PH3R-FSOCITEY',                   // store name with dash
  ].filter((v, i, a) => v && a.indexOf(v) === i) // dedupe + remove empty

  const results: Record<string, { status: number; ok: boolean; snippet: string }> = {}

  for (const username of candidates) {
    // Query-param auth
    const url = `https://www.tindie.com/api/v1/order/?format=json&limit=1&username=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`
    try {
      const res = await fetch(url, { cache: 'no-store' })
      const body = await res.text()
      results[`qp:${username}`] = { status: res.status, ok: res.ok, snippet: body.slice(0, 100) }
    } catch (e: any) {
      results[`qp:${username}`] = { status: 0, ok: false, snippet: e.message }
    }
  }

  return NextResponse.json({
    apikey_last6: apiKey.slice(-6),
    apikey_length: apiKey.length,
    results,
  })
}
