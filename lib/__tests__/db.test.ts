import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vercel/postgres', () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}))

const { saveContactSubmission, saveCvLead } = await import('@/lib/db')
const { sql } = await import('@vercel/postgres')

beforeEach(() => {
  delete process.env.POSTGRES_URL
  delete process.env.DATABASE_URL
  delete process.env.POSTGRES_PRISMA_URL
  delete process.env.POSTGRES_URL_NON_POOLING
  delete process.env.DATABASE_URL_UNPOOLED
  vi.clearAllMocks()
})

describe('db helpers without any Postgres connection string configured', () => {
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

describe('db helpers with a non-standard Postgres env var name', () => {
  it('falls back to DATABASE_URL and mirrors it into POSTGRES_URL', async () => {
    process.env.DATABASE_URL = 'postgres://example-fallback'
    await saveContactSubmission({
      name: 'Budi',
      email: 'budi@example.com',
      company: '',
      purpose: 'recruitment',
      message: '',
    })
    expect(process.env.POSTGRES_URL).toBe('postgres://example-fallback')
    expect(sql).toHaveBeenCalled()
  })
})
