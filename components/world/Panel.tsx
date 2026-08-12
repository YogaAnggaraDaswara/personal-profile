'use client'
import type { ReactNode } from 'react'
import { Html } from '@react-three/drei'

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
 *
 * Coordinates are local to the enclosing Place, which owns corridor placement.
 */
export default function Panel({
  position = [0, 0, 0],
  width = 380,
  children,
  className = '',
}: {
  /** Offset from the place's centre, in world units. */
  position?: [number, number, number]
  /** CSS pixel width of the panel before the 3D scale is applied. */
  width?: number
  children: ReactNode
  className?: string
}) {
  return (
    <Html
      transform
      /* Apparent size scales with this, and it is easy to get wrong: at 14 the
         About panel grew past the viewport and clipped on both sides. 7 puts a
         380px panel at roughly half the screen width on a desktop. */
      distanceFactor={7}
      position={position}
      // Panels are content, not decoration, so they stay in the a11y tree.
      wrapperClass="world-panel-wrapper"
    >
      <div style={{ width }} className={`world-panel ${className}`}>
        {children}
      </div>
    </Html>
  )
}
