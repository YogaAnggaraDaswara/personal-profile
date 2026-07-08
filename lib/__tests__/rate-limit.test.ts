import { describe, it, expect, beforeEach } from 'vitest'
import { isRateLimited } from '@/lib/rate-limit'

beforeEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
})

describe('isRateLimited (in-memory fallback, Upstash not configured)', () => {
  it('allows up to 5 requests then blocks the 6th for the same bucket+ip', async () => {
    const ip = '30.0.0.1'
    for (let i = 0; i < 5; i++) {
      expect(await isRateLimited('test-bucket-a', ip)).toBe(false)
    }
    expect(await isRateLimited('test-bucket-a', ip)).toBe(true)
  })

  it('tracks buckets independently for the same ip', async () => {
    const ip = '30.0.0.2'
    for (let i = 0; i < 5; i++) {
      expect(await isRateLimited('bucket-x', ip)).toBe(false)
    }
    expect(await isRateLimited('bucket-x', ip)).toBe(true)
    expect(await isRateLimited('bucket-y', ip)).toBe(false)
  })
})
