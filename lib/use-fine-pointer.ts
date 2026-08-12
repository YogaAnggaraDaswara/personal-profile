'use client'
import { useSyncExternalStore } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

/**
 * True only on devices with a precise pointer (mouse / trackpad).
 *
 * Use this to skip pointer-driven effects such as cursor-follow glow,
 * magnetic hover, and 3D tilt. On touch devices those effects never
 * fire anyway, so running their springs and listeners is wasted work.
 *
 * The server snapshot is false so server and first client render agree
 * (no hydration mismatch), then it flips on after hydration if the
 * device qualifies.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
