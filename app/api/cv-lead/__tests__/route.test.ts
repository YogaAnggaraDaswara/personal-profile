import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '@/app/api/cv-lead/route'

function req(body: unknown, ip: string) {
  return new Request('http://localhost/api/cv-lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  phone: '+62 812-3456-7890',
  company: 'PT Contoh',
  purpose: 'recruitment',
  website: '',
}

beforeEach(() => {
  delete process.env.RESEND_API_KEY
  delete process.env.NOTIF_TO_EMAIL
})

describe('POST /api/cv-lead', () => {
  it('returns downloadUrl on valid submit', async () => {
    const res = await POST(req(valid, '20.0.0.1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.downloadUrl).toBe('/cv/yoga-daswara-cv.pdf')
  })

  it('returns 422 with field errors on invalid payload', async () => {
    const res = await POST(req({ ...valid, phone: 'x' }, '20.0.0.2'))
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.ok).toBe(false)
    expect(json.errors.phone).toBeDefined()
  })

  it('returns generic success without downloadUrl when honeypot filled', async () => {
    const res = await POST(req({ ...valid, website: 'http://bot.example' }, '20.0.0.3'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.downloadUrl).toBeUndefined()
  })

  it('returns 429 after limit exceeded', async () => {
    let last: Response | null = null
    for (let i = 0; i < 6; i++) last = await POST(req(valid, '20.0.0.4'))
    expect(last!.status).toBe(429)
  })

  it('does not rate-limit honeypot submissions even after quota exhausted', async () => {
    for (let i = 0; i < 5; i++) await POST(req(valid, '20.0.0.5'))
    const res = await POST(req({ ...valid, website: 'http://bot.example' }, '20.0.0.5'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.downloadUrl).toBeUndefined()
  })

  it('returns 400 on non-JSON body', async () => {
    const res = await POST(
      new Request('http://localhost/api/cv-lead', {
        method: 'POST',
        headers: { 'x-forwarded-for': '20.0.0.6' },
        body: 'not json',
      }),
    )
    expect(res.status).toBe(400)
  })
})
