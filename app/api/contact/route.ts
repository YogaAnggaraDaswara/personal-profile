import { NextResponse } from 'next/server'
import { validateContact, type ContactPayload } from '@/lib/contact-validation'

const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, { count: number; ts: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || now - h.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
    return false
  }
  h.count += 1
  return h.count > LIMIT
}

async function notify(value: ContactPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIF_TO_EMAIL
  if (!key || !to) {
    console.log('[contact] notification skipped (RESEND_API_KEY/NOTIF_TO_EMAIL not set)')
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Profile Site <onboarding@resend.dev>',
        to: [to],
        subject: `[Profile] ${value.purpose} - ${value.name}`,
        text: [
          `Nama    : ${value.name}`,
          `Email   : ${value.email}`,
          `Company : ${value.company || '-'}`,
          `Purpose : ${value.purpose}`,
          `Message : ${value.message || '-'}`,
        ].join('\n'),
      }),
    })
    if (!res.ok) console.error('[contact] notification failed', res.status)
  } catch (err) {
    console.error('[contact] notification failed', err)
  }
}

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'bad_request' } }, { status: 400 })
  }

  const result = validateContact(raw)
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 })
  }

  // Honeypot: bots get a generic success with no contact data and no notification.
  // Checked before rate-limiting so honeypot traffic never consumes the shared IP quota.
  if (result.value.website) {
    return NextResponse.json({ ok: true })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: { form: 'rate_limited' } }, { status: 429 })
  }

  await notify(result.value)

  return NextResponse.json({
    ok: true,
    contact: {
      email: process.env.CONTACT_EMAIL ?? '',
      whatsapp: (process.env.CONTACT_WA ?? '').replace(/\D/g, ''),
    },
  })
}
