'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { profile } from '@/content/profile'
import { useLang } from '@/lib/i18n'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * The arrival point - what a visitor sees before touching the scrollbar.
 *
 * profile.png is kept here as an explicit requirement, but as a lit panel
 * standing in the space rather than an <img>: it catches the zone colour on its
 * edges and drifts with the camera, so the person is part of the world instead
 * of pasted over it.
 */
export default function Arrival() {
  const { t } = useLang()
  const texture = useTexture('/profile.png')
  const frame = useRef<THREE.Mesh>(null)

  // Keep the photo's own proportions; a stretched face is worse than a small one.
  // useTexture types `image` as {} because it can be a canvas or a video frame,
  // neither of which is what a PNG loader hands back.
  const image = texture.image as { width?: number; height?: number } | undefined
  const aspect = image?.width && image?.height ? image.width / image.height : 3 / 4
  const height = 9
  const width = height * aspect

  useFrame((state) => {
    if (!frame.current) return
    // A slow breathing tilt. Static geometry in a moving space reads as a bug.
    const t = state.clock.elapsedTime
    frame.current.rotation.y = -0.28 + Math.sin(t * 0.35) * 0.05
    frame.current.rotation.x = Math.sin(t * 0.27) * 0.03
  })


  return (
    <group>
      <mesh ref={frame} position={[6.2, -0.4, -2]}>
        <planeGeometry args={[width, height]} />
        {/* Basic material: the photo is already lit, and adding a light rig here
            would only muddy it. Tone mapping is off so it stays true to the file. */}
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>

      {/* Rim glow behind the photo. Additive and faint on purpose: as a normal
          blended plane at 0.16 it read as a solid teal card behind the person
          rather than light coming off the edges. */}
      <mesh position={[6.2, -0.4, -2.6]} rotation={[0, -0.28, 0]}>
        <planeGeometry args={[width * 1.06, height * 1.04]} />
        <meshBasicMaterial
          color={ACCENT.cyan}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Panel position={[-5.0, 1.2, -1]} width={400}>
        <p className="world-eyebrow">{t({ id: 'Halo, saya', en: 'Hello, I am' })}</p>
        <h1 className="world-title">{profile.name}</h1>
        <p className="world-body">{t(profile.tagline)}</p>
        <p className="world-hint">
          {t({ id: 'Scroll untuk masuk', en: 'Scroll to enter' })}
        </p>
      </Panel>
    </group>
  )
}
