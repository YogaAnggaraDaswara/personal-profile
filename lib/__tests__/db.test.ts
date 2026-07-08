import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveContactSubmission, saveCvLead } from '@/lib/db'

beforeEach(() => {
  delete process.env.POSTGRES_URL
  vi.restoreAllMocks()
})

describe('db helpers without POSTGRES_URL configured', () => {
  it('saveContactSubmission resolves without throwing and logs a skip message', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await expect(
      saveContactSubmission({
        name: 'Budi',
        email: 'budi@example.com',
        company: '',
        purpose: 'recruitment',
        message: '',
      }),
    ).resolves.toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('skipped saving contact submission'))
  })

  it('saveCvLead resolves without throwing and logs a skip message', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await expect(
      saveCvLead({ name: 'Budi', email: 'budi@example.com', phone: '+6281234567890' }),
    ).resolves.toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('skipped saving cv lead'))
  })
})
