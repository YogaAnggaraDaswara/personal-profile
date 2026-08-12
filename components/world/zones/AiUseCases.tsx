'use client'
import { aiUseCases } from '@/content/aiUseCases'
import { useLang } from '@/lib/i18n'
import { ACCENT, SPACING } from '../theme'
import Panel from '../Panel'

/**
 * AI use cases as a lattice of small nodes wired together - the visual argument
 * being that these are not isolated experiments but a connected practice.
 * Connections are drawn as thin boxes between consecutive nodes rather than
 * lines, for the same driver-imposed line-width reason as the career rail.
 */
export default function AiUseCases({ depth }: { depth: number }) {
  const { t } = useLang()
  const z = -depth * SPACING

  const nodes = aiUseCases.map((_, i) => {
    const angle = (i / Math.max(aiUseCases.length, 1)) * Math.PI * 2
    return [Math.cos(angle) * 3.4, Math.sin(angle) * 2.1, Math.sin(angle * 2) * 1.6] as const
  })

  return (
    <group>
      <group position={[5.8, -0.2, z - 3]}>
        {nodes.map((n, i) => (
          <mesh key={i} position={[n[0], n[1], n[2]]}>
            <tetrahedronGeometry args={[0.42, 0]} />
            <meshBasicMaterial color={ACCENT.emerald} wireframe />
          </mesh>
        ))}
        {nodes.map((n, i) => {
          const m = nodes[(i + 1) % nodes.length]
          const from = [n[0], n[1], n[2]] as const
          const to = [m[0], m[1], m[2]] as const
          const mid = [
            (from[0] + to[0]) / 2,
            (from[1] + to[1]) / 2,
            (from[2] + to[2]) / 2,
          ] as [number, number, number]
          const length = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2])
          // Point the connector at its target: yaw from the XZ offset, pitch from
          // the vertical rise over the horizontal run.
          const yaw = Math.atan2(to[0] - from[0], to[2] - from[2])
          const pitch = Math.atan2(
            to[1] - from[1],
            Math.hypot(to[0] - from[0], to[2] - from[2]),
          )
          return (
            <mesh key={`c${i}`} position={mid} rotation={[Math.PI / 2 - pitch, yaw, 0]}>
              <boxGeometry args={[0.02, length, 0.02]} />
              <meshBasicMaterial color={ACCENT.emerald} transparent opacity={0.34} />
            </mesh>
          )
        })}
      </group>

      <Panel depth={depth} position={[-6.8, 0.7, -1]} width={560}>
        <h2 className="world-heading">{t({ id: 'Use Case AI', en: 'AI Use Cases' })}</h2>
        <ul className="world-usecase-list">
          {aiUseCases.map((u, i) => (
            <li key={i}>
              <strong>{t(u.title)}</strong>
              <span>{t(u.description)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  )
}
