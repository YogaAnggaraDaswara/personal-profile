import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '@/app/api/contact/route'

function req(body: unknown, ip: string) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  company: '',
  purpose: 'collaboration',
  message: '',
  website: '',
}

beforeEach(() => {
  process.env.CONTACT_EMAIL = 'dummy-contact@example.com'
  process.env.CONTACT_WA = '+62 812-0000-0000'
  delete process.env.RESEND_API_KEY
})

describe('POST /api/contact', () => {
  it('returns contact on valid submit', async () => {
    const res = await POST(req(valid, '10.0.0.1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.contact.email).toBe('dummy-contact@example.com')
    expect(json.contact.whatsapp).toBe('6281200000000')
  })

  it('returns 422 with field errors on invalid payload', async () => {
    const res = await POST(req({ ...valid, email: 'nope' }, '10.0.0.2'))
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.ok).toBe(false)
    expect(json.errors.email).toBeDefined()
  })

  it('returns generic success without contact when honeypot filled', async () => {
    const res = await POST(req({ ...valid, website: 'http://bot.example' }, '10.0.0.3'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.contact).toBeUndefined()
  })

  it('returns 429 after limit exceeded', async () => {
    let last: Response | null = null
    for (let i = 0; i < 6; i++) last = await POST(req(valid, '10.0.0.4'))
    expect(last!.status).toBe(429)
  })

  it('returns 400 on non-JSON body', async () => {
    const res = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'x-forwarded-for': '10.0.0.5' },
        body: 'not json',
      }),
    )
    expect(res.status).toBe(400)
  })
})
