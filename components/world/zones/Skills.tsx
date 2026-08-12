'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { skillGroups } from '@/content/skills'
import { useLang } from '@/lib/i18n'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * Skills as orbiting clusters. One shell per group, one point per skill, with
 * the point's distance from the shell centre set by proficiency - expert sits
 * tight to the core, intermediate drifts out. So the shape of a cluster says
 * how deep the group runs before any label is read.
 */
const RADIUS_BY_LEVEL: Record<string, number> = {
  expert: 0.9,
  advanced: 1.5,
  intermediate: 2.1,
}

export default function Skills() {
  const { t } = useLang()
  const group = useRef<THREE.Group>(null)

  /**
   * Positions are generated once from a deterministic hash of the skill name,
   * not from Math.random - a random layout would reshuffle on every remount and
   * the clusters would never look like the same object twice.
   */
  const clusters = useMemo(
    () =>
      skillGroups.map((g, gi) => ({
        centre: new THREE.Vector3(
          (gi % 3) * 4.2 - 4.2,
          Math.floor(gi / 3) * 3.6 - 1.8,
          -(gi % 2) * 2.4,
        ),
        points: g.items.map((s) => {
          let hash = 0
          for (let i = 0; i < s.name.length; i++) hash = (hash * 31 + s.name.charCodeAt(i)) % 9973
          const theta = (hash % 360) * (Math.PI / 180)
          const phi = ((hash >> 3) % 180) * (Math.PI / 180)
          const r = RADIUS_BY_LEVEL[s.level] ?? 1.8
          return new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * r,
            Math.cos(phi) * r * 0.7,
            Math.sin(phi) * Math.sin(theta) * r,
          )
        }),
      })),
    [],
  )

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group>
      <group ref={group} position={[5.6, -0.4, -4]}>
        {clusters.map((cluster, gi) => (
          <group key={gi} position={cluster.centre}>
            {/* Shell hints at the group's boundary without enclosing the points. */}
            <mesh>
              <icosahedronGeometry args={[2.2, 1]} />
              <meshBasicMaterial color={ACCENT.violet} wireframe transparent opacity={0.12} />
            </mesh>
            {cluster.points.map((p, pi) => (
              <mesh key={pi} position={p}>
                <sphereGeometry args={[0.11, 8, 8]} />
                <meshBasicMaterial color={pi % 3 === 0 ? ACCENT.cyan : ACCENT.violet} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <Panel position={[-5.0, 0.6, -1]} width={400}>
        <h2 className="world-heading">{t({ id: 'Skill & Teknologi', en: 'Skills & Technologies' })}</h2>
        <ul className="world-chip-groups">
          {skillGroups.map((g, i) => (
            <li key={i}>
              <strong>{t(g.title)}</strong>
              <span>{g.items.map((s) => s.name).join(' · ')}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  )
}
