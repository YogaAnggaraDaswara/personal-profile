import type { Bi } from './i18n-core'

export const PURPOSES = ['recruitment', 'collaboration', 'consultation', 'other'] as const
export type Purpose = (typeof PURPOSES)[number]

export const PURPOSE_OPTIONS: { value: Purpose; label: Bi }[] = [
  { value: 'recruitment', label: { id: 'Rekrutmen', en: 'Recruitment' } },
  { value: 'collaboration', label: { id: 'Kolaborasi Project', en: 'Project Collaboration' } },
  { value: 'consultation', label: { id: 'Konsultasi', en: 'Consultation' } },
  { value: 'other', label: { id: 'Lainnya', en: 'Other' } },
]

export type ContactPayload = {
  name: string
  email: string
  company: string
  purpose: Purpose
  message: string
  website: string
}

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(raw: unknown): ValidationResult {
  const d = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const name = str(d.name)
  const email = str(d.email)
  const company = str(d.company)
  const purpose = str(d.purpose)
  const message = str(d.message)
  const website = str(d.website)

  const errors: Record<string, string> = {}
  if (name.length < 2 || name.length > 100) errors.name = 'invalid'
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'invalid'
  if (company.length < 1 || company.length > 150) errors.company = 'invalid'
  if (!(PURPOSES as readonly string[]).includes(purpose)) errors.purpose = 'invalid'
  if (message.length < 1 || message.length > 1000) errors.message = 'invalid'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, email, company, purpose: purpose as Purpose, message, website } }
}
