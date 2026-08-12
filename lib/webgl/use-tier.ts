'use client'
import { useEffect, useState } from 'react'
import { measureTier, type Tier } from './capability'

/**
 * Resolves the device tier after mount.
 *
 * Starts as null rather than guessing, so the first render is the DOM page for
 * everyone. That is the safe default: the DOM page is the content, and the
 * world is an enhancement layered on top of it once we know the device can
 * carry it. It also means the server and the first client render always agree.
 */
export function useTier(): Tier | null {
  const [tier, setTier] = useState<Tier | null>(null)

  useEffect(() => {
    let alive = true
    // The probe is async, so this is a subscription-shaped effect rather than a
    // synchronous setState - the state lands in a callback, after a real
    // measurement, not during the effect body.
    measureTier().then((t) => {
      if (alive) setTier(t)
    })
    return () => {
      alive = false
    }
  }, [])

  return tier
}
