import { NextResponse } from 'next/server'

// Temporary public diagnostic endpoint — DELETE after debugging
export async function GET() {
  const username = process.env.TINDIE_USERNAME ?? '(not set)'
  const apiKey   = process.env.TINDIE_API_KEY   ?? '(not set)'

  const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64')

  // Try Basic Auth
  let basicStatus = 0, basicBody = ''
  try {
    const res = await fetch('https://www.tindie.com/api/v1/order/?format=json&limit=1', {
      cache: 'no-store',
      headers: { 'Authorization': `Basic ${credentials}` },
    })
    basicStatus = res.status
    basicBody   = await res.text()
  } catch (e: any) { basicBody = e.message }

  // Try query-param auth
  let qpStatus = 0, qpBody = ''
  try {
    const url = `https://www.tindie.com/api/v1/order/?format=json&limit=1&username=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, { cache: 'no-store' })
    qpStatus = res.status
    qpBody   = await res.text()
  } catch (e: any) { qpBody = e.message }

  return NextResponse.json({
    env: {
      username_set:     username !== '(not set)',
      username_length:  username.length,
      username_preview: username.slice(0, 4) + '...' + username.slice(-4),
      apikey_set:       apiKey !== '(not set)',
      apikey_length:    apiKey.length,
      apikey_last6:     apiKey.slice(-6),
    },
    basic_auth: {
      status: basicStatus,
      body:   basicBody.slice(0, 400),
    },
    query_params: {
      status: qpStatus,
      body:   qpBody.slice(0, 400),
    },
  })
}
