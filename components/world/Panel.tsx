'use client'
import type { ReactNode } from 'react'
import { Html } from '@react-three/drei'
import { SPACING } from './theme'

/**
 * Text inside the world.
 *
 * Deliberately DOM rendered into 3D space via drei's `<Html transform>` rather
 * than extruded geometry or SDF text. Three reasons: the type stays crisp at any
 * distance, it is selectable and translatable like the rest of the site, and it
 * needs no webfont fetch - troika-based 3D text pulls a font over the network,
 * which is one more thing to fail behind a corporate proxy.
 *
 * The trade-off is honest: these panels are DOM, so they do not occlude behind
 * geometry. Places are laid out so nothing needs to pass in front of them.
 */
export default function Panel({
  depth,
  position = [0, 0, 0],
  width = 460,
  children,
  className = '',
}: {
  /** Which place this panel belongs to; multiplied into world Z. */
  depth: number
  /** Offset from the place's centre, in world units. */
  position?: [number, number, number]
  /** CSS pixel width of the panel before the 3D scale is applied. */
  width?: number
  children: ReactNode
  className?: string
}) {
  const [x, y, z] = position
  return (
    <Html
      transform
      // A distance factor keeps the panel's apparent size stable as the camera
      // approaches, so text does not balloon on the way past.
      distanceFactor={14}
      position={[x, y, -depth * SPACING + z]}
      // Panels are content, not decoration, so they stay in the a11y tree.
      wrapperClass="world-panel-wrapper"
    >
      <div style={{ width }} className={`world-panel ${className}`}>
        {children}
      </div>
    </Html>
  )
}
