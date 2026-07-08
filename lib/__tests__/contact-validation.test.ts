import { describe, it, expect } from 'vitest'
import { validateContact } from '@/lib/contact-validation'

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  company: 'PT Contoh',
  purpose: 'recruitment',
  message: 'Halo, tertarik diskusi.',
  website: '',
}

describe('validateContact', () => {
  it('accepts a valid payload', () => {
    const r = validateContact(valid)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.name).toBe('Budi Santoso')
  })

  it('trims whitespace', () => {
    const r = validateContact({ ...valid, name: '  Budi  ' })
    if (r.ok) expect(r.value.name).toBe('Budi')
    expect(r.ok).toBe(true)
  })

  it('rejects short name', () => {
    const r = validateContact({ ...valid, name: 'B' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.name).toBeDefined()
  })

  it('rejects bad email', () => {
    const r = validateContact({ ...valid, email: 'not-an-email' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.email).toBeDefined()
  })

  it('rejects unknown purpose', () => {
    const r = validateContact({ ...valid, purpose: 'spam' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.purpose).toBeDefined()
  })

  it('rejects non-object input', () => {
    const r = validateContact('junk')
    expect(r.ok).toBe(false)
  })

  it('keeps honeypot field', () => {
    const r = validateContact({ ...valid, website: 'http://bot.example' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.website).toBe('http://bot.example')
  })
})
