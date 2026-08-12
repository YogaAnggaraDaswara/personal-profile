'use client'
import { experiences } from '@/content/experience'
import { useLang } from '@/lib/i18n'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * Career as a path the camera travels beside.
 *
 * Markers sit at increasing depth in reverse-chronological order, matching the
 * content file, so scrolling forward walks backwards through time. The rail
 * between them is one long thin box rather than a line primitive, because
 * WebGL line width is capped at 1px on most drivers and would vanish.
 */
export default function Experience() {
  const { t } = useLang()
  const step = 3.1
  const railLength = Math.max(experiences.length - 1, 1) * step + 2

  return (
    <group position={[6, -1, -4]}>
      <mesh position={[0, 0, -railLength / 2 + 1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.05, railLength, 0.05]} />
        <meshBasicMaterial color={ACCENT.violet} transparent opacity={0.45} />
      </mesh>

      {experiences.map((exp, i) => (
        <group key={exp.company + i} position={[0, 0, -i * step]}>
          {/* Marker: a ring standing on the rail, brighter for the current role. */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.05, 8, 28]} />
            <meshBasicMaterial
              color={i === 0 ? ACCENT.cyan : ACCENT.violet}
              transparent
              opacity={i === 0 ? 0.95 : 0.55}
            />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.04, 2.2, 0.04]} />
            <meshBasicMaterial color={ACCENT.violet} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      <Panel position={[-11.0, 1.2, 0]} width={400}>
        <h2 className="world-heading">{t({ id: 'Pengalaman', en: 'Experience' })}</h2>
        <ol className="world-timeline">
          {experiences.map((exp, i) => (
            <li key={exp.company + i}>
              <strong>{t(exp.role)}</strong>
              <em>
                {exp.company} · {exp.period}
              </em>
              <span>{t(exp.points[0])}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </group>
  )
}
