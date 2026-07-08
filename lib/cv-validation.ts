import { PURPOSES, type Purpose } from './contact-validation'

export type CvLeadPayload = {
  name: string
  email: string
  phone: string
  company: string
  purpose: Purpose
  website: string
}

export type CvValidationResult =
  | { ok: true; value: CvLeadPayload }
  | { ok: false; errors: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[0-9+\-\s]{8,20}$/

export function validateCvLead(raw: unknown): CvValidationResult {
  const d = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const name = str(d.name)
  const email = str(d.email)
  const phone = str(d.phone)
  const company = str(d.company)
  const purpose = str(d.purpose)
  const website = str(d.website)

  const errors: Record<string, string> = {}
  if (name.length < 2 || name.length > 100) errors.name = 'invalid'
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'invalid'
  if (!PHONE_RE.test(phone)) errors.phone = 'invalid'
  if (company.length < 1 || company.length > 150) errors.company = 'invalid'
  if (!(PURPOSES as readonly string[]).includes(purpose)) errors.purpose = 'invalid'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, email, phone, company, purpose: purpose as Purpose, website } }
}
