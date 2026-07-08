import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { verifyTurnstile } from '@/lib/turnstile'

beforeEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('verifyTurnstile', () => {
  it('allows through when TURNSTILE_SECRET_KEY is not configured', async () => {
    expect(await verifyTurnstile('', '1.2.3.4')).toBe(true)
  })

  it('rejects an empty token when configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'dummy-secret'
    expect(await verifyTurnstile('', '1.2.3.4')).toBe(false)
  })

  it('returns true when Cloudflare reports success', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'dummy-secret'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ success: true }) }),
    )
    expect(await verifyTurnstile('valid-token', '1.2.3.4')).toBe(true)
  })

  it('returns false when Cloudflare reports failure', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'dummy-secret'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ success: false }) }),
    )
    expect(await verifyTurnstile('bad-token', '1.2.3.4')).toBe(false)
  })

  it('returns false when the verification request throws', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'dummy-secret'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    expect(await verifyTurnstile('any-token', '1.2.3.4')).toBe(false)
  })
})
