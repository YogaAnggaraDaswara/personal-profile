'use client'
import { useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { SPACING, VIEW_DISTANCE } from './theme'

/**
 * Puts a place in the corridor, and mounts it only while the camera is near.
 *
 * All world placement lives here so zones can work in local coordinates - a zone
 * positions things relative to its own centre and never needs to know its depth
 * or how far ahead of the camera it sits.
 *
 * Without this every place is in the frustum at once - the corridor is under 300
 * units long and the camera sees 120 of it - so eight sets of panels stack on
 * screen and the tunnel disappears behind them. Unmounting rather than hiding
 * also means only one place's geometry and DOM panels exist at a time.
 *
 * The state flips at most twice per place per pass, when the camera crosses the
 * threshold, so this is not a per-frame setState.
 */
export default function Place({
  depth,
  children,
  /** How many places away the camera must be before this one appears. */
  range = 0.85,
}: {
  depth: number
  children: ReactNode
  range?: number
}) {
  const [near, setNear] = useState(depth === 0)

  useFrame((state) => {
    const distance = Math.abs(state.camera.position.z + depth * SPACING)
    const shouldShow = distance < range * SPACING
    // Compare before setting: React bails out on an identical value, but the
    // comparison keeps the intent obvious at the call site.
    if (shouldShow !== near) setNear(shouldShow)
  })

  if (!near) return null

  return <group position={[0, 0, -depth * SPACING - VIEW_DISTANCE]}>{children}</group>
}
