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

  /**
   * Build on mount, tear down on unmount, and survive being cycled: React runs
   * effect cleanup once on mount in development, so a pool that could only be
   * disposed would end up alive but empty - which is exactly what happened, and
   * it rendered an empty corridor with no error anywhere.
   */
  useEffect(() => {
    pool.build()
    return () => pool.teardown()
  }, [pool])

  useFrame((state, delta) => {
    // Clamp: a tab returning from the background reports a huge delta, which
    // would jump the shader clock by seconds in a single step.
    pool.update(state.camera.position.z, Math.min(delta, 1 / 30))
  })

  return <primitive object={pool.group} />
}
