import { NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Verify Meta `X-Hub-Signature-256` using constant-time hex comparison
 * (same approach as `server/src/controllers/webhook.controller.ts`).
 */
function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader?.startsWith('sha256=')) return false

  const secret = process.env.META_APP_SECRET
  if (!secret) {
    console.error('[webhook] META_APP_SECRET is not configured')
    return false
  }

  const received = signatureHeader.slice(7)
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')

  try {
    const a = Buffer.from(received, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-hub-signature-256')

    if (!verifySignature(rawBody, signature)) {
      console.warn('[webhook] Invalid or missing Meta HMAC signature')
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 403 })
    }

    const payload = JSON.parse(rawBody) as { entry?: unknown[] }

    console.log('[webhook] Verified payload entry:', payload.entry?.[0] != null ? 'present' : 'none')

    return NextResponse.json({ status: 'received' }, { status: 200 })
  } catch (error) {
    console.error('[webhook] Processing error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const verifyToken =
    process.env.META_VERIFY_TOKEN ?? process.env.WHATSAPP_VERIFY_TOKEN ?? ''

  if (!verifyToken) {
    console.error('[webhook] META_VERIFY_TOKEN / WHATSAPP_VERIFY_TOKEN not set')
    return NextResponse.json({ error: 'Webhook verify not configured' }, { status: 503 })
  }

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
