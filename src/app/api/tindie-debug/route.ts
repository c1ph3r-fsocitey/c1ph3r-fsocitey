import { NextResponse } from 'next/server'

// Diagnostic endpoint — disabled after debugging complete
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
