import { describe, it, expect } from 'vitest'
import { pick, type Bi } from '@/lib/i18n-core'

const b: Bi = { id: 'Halo', en: 'Hello' }

describe('pick', () => {
  it('returns Indonesian text for lang id', () => {
    expect(pick(b, 'id')).toBe('Halo')
  })
  it('returns English text for lang en', () => {
    expect(pick(b, 'en')).toBe('Hello')
  })
  it('falls back to id when en is empty', () => {
    expect(pick({ id: 'Isi', en: '' }, 'en')).toBe('Isi')
  })
})
