'use client'
import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { TunnelPool } from '@/lib/webgl/tunnel-pool'

/**
 * Mounts the recycled corridor planes.
 *
 * All per-frame work lives in TunnelPool, outside React, because it mutates
 * meshes and shader uniforms sixty times a second. This component owns only the
 * pool's lifetime.
 *
 * The layer count is fixed for the life of the component - it comes from the
 * device tier, and the caller remounts this by key if the tier ever changes -
 * so the pool is built once in the state initialiser and disposed on unmount.
 */
export default function Tunnel({ layers }: { layers: number }) {
  const [pool] = useState(() => new TunnelPool(layers))

  // Shader programs and geometries live in GPU memory, which is not garbage
  // collected. Without this, every remount leaks one geometry and N programs.
  useEffect(() => () => pool.dispose(), [pool])

  useFrame((state, delta) => {
    // Clamp: a tab returning from the background reports a huge delta, which
    // would jump the shader clock by seconds in a single step.
    pool.update(state.camera.position.z, Math.min(delta, 1 / 30))
  })

  return <primitive object={pool.group} />
}
