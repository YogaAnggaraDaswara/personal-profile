'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { department, orgUnits } from '@/content/organization'
import { useLang } from '@/lib/i18n'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * The department, standing up.
 *
 * One tower per unit, its height set by headcount, its colour by the unit's
 * accent. A beam runs from the department node down to each tower - the same
 * spine the DOM route draws in 2D, here as actual geometry the camera passes
 * between.
 *
 * Headcount only. Names stay out of the repo; see content/organization.ts.
 */
export default function Department() {
  const { t } = useLang()
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    // The cluster rotates slowly so the towers read as volumes rather than as
    // flat bars, without asking the visitor to drag anything.
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.22
  })

  const spread = 3.4
  // A unit with an unpublished headcount still needs a visible tower, so the
  // height floor is what stands in for "not disclosed".
  const heightOf = (n: number) => 2.2 + n * 0.95

  return (
    <group>
      <group ref={group} position={[5.2, -3.4, -3]}>
        {orgUnits.map((unit, i) => {
          const h = heightOf(unit.headcount)
          const x = (i - (orgUnits.length - 1) / 2) * spread
          const colour = ACCENT[unit.accent]
          return (
            <group key={unit.key} position={[x, 0, 0]}>
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[1.9, h, 1.9]} />
                <meshBasicMaterial color={colour} transparent opacity={0.12} />
              </mesh>
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[1.92, h + 0.02, 1.92]} />
                <meshBasicMaterial color={colour} wireframe transparent opacity={0.62} />
              </mesh>
              {/* Cap: the brightest surface, so bloom picks out the tower tops. */}
              <mesh position={[0, h + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.9, 1.9]} />
                <meshBasicMaterial color={colour} transparent opacity={0.5} />
              </mesh>
              {/* Beam from the department node above down into this tower. */}
              <mesh position={[0, h + 1.9, 0]}>
                <boxGeometry args={[0.04, 3.6, 0.04]} />
                <meshBasicMaterial color={colour} transparent opacity={0.4} />
              </mesh>
            </group>
          )
        })}

        {/* The department node the beams hang from. */}
        <mesh position={[0, 9.4, 0]}>
          <octahedronGeometry args={[0.85, 0]} />
          <meshBasicMaterial color={ACCENT.violet} wireframe />
        </mesh>
      </group>

      <Panel position={[-5.0, 0.8, -1]} width={400}>
        <p className="world-eyebrow">{t(department.role)}</p>
        <h2 className="world-heading">{t(department.name)}</h2>
        <p className="world-body">{t(department.summary)}</p>
        <ul className="world-unit-list">
          {orgUnits.map((unit) => (
            <li key={unit.key} style={{ ['--unit' as string]: ACCENT[unit.accent] }}>
              <strong>{t(unit.name)}</strong>
              {unit.headcount > 0 && (
                <em>
                  {unit.headcount} {t({ id: 'anggota', en: 'members' })}
                </em>
              )}
              <span>{t(unit.focus)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  )
}
