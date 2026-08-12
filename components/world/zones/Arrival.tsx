'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { profile } from '@/content/profile'
import { useLang } from '@/lib/i18n'
import { ACCENT, SPACING } from '../theme'
import Panel from '../Panel'

/**
 * The arrival point - what a visitor sees before touching the scrollbar.
 *
 * profile.png is kept here as an explicit requirement, but as a lit panel
 * standing in the space rather than an <img>: it catches the zone colour on its
 * edges and drifts with the camera, so the person is part of the world instead
 * of pasted over it.
 */
export default function Arrival({ depth }: { depth: number }) {
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

  const z = -depth * SPACING

  return (
    <group>
      <mesh ref={frame} position={[6.2, -0.4, z - 2]}>
        <planeGeometry args={[width, height]} />
        {/* Basic material: the photo is already lit, and adding a light rig here
            would only muddy it. Tone mapping is off so it stays true to the file. */}
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>

      {/* Rim glow behind the photo, tinted with the arrival accent. */}
      <mesh position={[6.2, -0.4, z - 2.4]}>
        <planeGeometry args={[width * 1.14, height * 1.1]} />
        <meshBasicMaterial color={ACCENT.cyan} transparent opacity={0.16} />
      </mesh>

      <Panel depth={depth} position={[-7.4, 1.4, -1]} width={520}>
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
