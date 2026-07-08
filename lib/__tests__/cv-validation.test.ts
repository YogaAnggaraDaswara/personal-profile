import { describe, it, expect } from 'vitest'
import { validateCvLead } from '@/lib/cv-validation'

const valid = { name: 'Budi Santoso', email: 'budi@example.com', phone: '+62 812-3456-7890', website: '' }

describe('validateCvLead', () => {
  it('accepts a valid payload', () => {
    const r = validateCvLead(valid)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.phone).toBe('+62 812-3456-7890')
  })

  it('trims whitespace', () => {
    const r = validateCvLead({ ...valid, name: '  Budi  ' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.name).toBe('Budi')
  })

  it('rejects short name', () => {
    const r = validateCvLead({ ...valid, name: 'B' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.name).toBeDefined()
  })

  it('rejects bad email', () => {
    const r = validateCvLead({ ...valid, email: 'not-an-email' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.email).toBeDefined()
  })

  it('rejects invalid phone', () => {
    const r = validateCvLead({ ...valid, phone: 'abc' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.phone).toBeDefined()
  })

  it('rejects non-object input', () => {
    const r = validateCvLead('junk')
    expect(r.ok).toBe(false)
  })

  it('keeps honeypot field', () => {
    const r = validateCvLead({ ...valid, website: 'http://bot.example' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.website).toBe('http://bot.example')
  })
})
