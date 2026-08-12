'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraRig } from '@/lib/webgl/camera-rig'
import { ACCENT } from './theme'

/** Reused so the frame loop allocates nothing. */
const scratch = new THREE.Color()

/**
 * Binds the camera to the page scroll and reports travel speed upward.
 *
 * The maths lives in CameraRig; this component only wires it to the frame loop
 * and holds the fog the rig tints.
 */
export default function Rig({ bloomFlash }: { bloomFlash?: (v: number) => void }) {
  const [rig] = useState(() => new CameraRig())
  const fog = useRef<THREE.Fog>(null)

  useFrame((state, delta) => {
    rig.update(state.camera, fog.current, scratch, state.pointer, delta)
    // Normalised against a speed that reads as "fast scrolling" in practice.
    bloomFlash?.(Math.min(rig.speed / 90, 1))
  })

  // Declared rather than assigned onto the scene: r3f attaches it, and a ref is
  // the sanctioned place to hold something the loop mutates every frame.
  return <fog ref={fog} attach="fog" args={[ACCENT.cyan, 14, 120]} />
}
