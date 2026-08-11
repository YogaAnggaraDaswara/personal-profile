'use client'
import { useEffect, useState } from 'react'

/**
 * True only on devices with a precise pointer (mouse / trackpad).
 *
 * Use this to skip pointer-driven effects such as cursor-follow glow,
 * magnetic hover, and 3D tilt. On touch devices those effects never
 * fire anyway, so running their springs and listeners is wasted work.
 *
 * Starts as false so server and first client render agree (no hydration
 * mismatch), then flips on after mount if the device qualifies.
 */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setFine(mq.matches)

    const onChange = (e: MediaQueryListEvent) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return fine
}
