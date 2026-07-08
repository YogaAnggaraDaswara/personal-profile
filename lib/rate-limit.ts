import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5

let ratelimit: Ratelimit | null | undefined

function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    ratelimit = null
    return ratelimit
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, '10 m'),
    prefix: 'ratelimit',
  })
  return ratelimit
}

// Per-instance fallback when Upstash isn't configured. Not reliable across
// concurrent serverless instances/cold starts - only a soft deterrent.
const memoryHits = new Map<string, { count: number; ts: number }>()

function isRateLimitedInMemory(key: string): boolean {
  const now = Date.now()
  const h = memoryHits.get(key)
  if (!h || now - h.ts > WINDOW_MS) {
    memoryHits.set(key, { count: 1, ts: now })
    return false
  }
  h.count += 1
  return h.count > LIMIT
}

export async function isRateLimited(bucket: string, ip: string): Promise<boolean> {
  const key = `${bucket}:${ip}`
  const rl = getRatelimit()
  if (!rl) {
    console.log('[rate-limit] Upstash not configured, using in-memory fallback')
    return isRateLimitedInMemory(key)
  }
  try {
    const { success } = await rl.limit(key)
    return !success
  } catch (err) {
    console.error('[rate-limit] Upstash request failed, falling back to in-memory', err)
    return isRateLimitedInMemory(key)
  }
}
