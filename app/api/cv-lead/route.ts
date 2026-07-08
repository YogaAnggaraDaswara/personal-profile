import { NextResponse } from 'next/server'
import { validateCvLead, type CvLeadPayload } from '@/lib/cv-validation'
import { saveCvLead } from '@/lib/db'
import { isRateLimited } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

async function notify(value: CvLeadPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIF_TO_EMAIL
  if (!key || !to) {
    console.log('[cv-lead] notification skipped (RESEND_API_KEY/NOTIF_TO_EMAIL not set)')
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Profile Site <onboarding@resend.dev>',
        to: [to],
        subject: `[CV Download] ${value.purpose} - ${value.name}`,
        text: [
          `Nama      : ${value.name}`,
          `Email     : ${value.email}`,
          `HP        : ${value.phone}`,
          `Perusahaan: ${value.company}`,
          `Keperluan : ${value.purpose}`,
        ].join('\n'),
      }),
    })
    if (!res.ok) console.error('[cv-lead] notification failed', res.status)
  } catch (err) {
    console.error('[cv-lead] notification failed', err)
  }
}

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'bad_request' } }, { status: 400 })
  }

  const result = validateCvLead(raw)
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 })
  }

  // Honeypot: bots get a generic success with no download URL and no notification.
  if (result.value.website) {
    return NextResponse.json({ ok: true })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const token = typeof (raw as Record<string, unknown>).turnstileToken === 'string'
    ? (raw as Record<string, unknown>).turnstileToken as string
    : ''
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json({ ok: false, errors: { form: 'captcha_failed' } }, { status: 422 })
  }

  if (await isRateLimited('cv-lead', ip)) {
    return NextResponse.json({ ok: false, errors: { form: 'rate_limited' } }, { status: 429 })
  }

  await Promise.all([notify(result.value), saveCvLead(result.value)])

  return NextResponse.json({ ok: true, downloadUrl: '/cv/yoga-daswara-cv.pdf' })
}
