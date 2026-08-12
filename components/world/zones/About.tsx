'use client'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { aiUseCases } from '@/content/aiUseCases'
import { useLang } from '@/lib/i18n'
import { ACCENT, SPACING } from '../theme'
import Panel from '../Panel'

/**
 * The narrative place. Stats stand as monoliths whose height encodes the number,
 * so the figures read as physical scale before they are read as text.
 *
 * Project and use-case counts are derived from the content files, matching how
 * the DOM route computes them - one source of truth, two presentations.
 */
export default function About({ depth }: { depth: number }) {
  const { t } = useLang()

  const stats = [
    { value: profile.stats[0].value, label: profile.stats[0].label },
    { value: projects.length, label: { id: 'Project', en: 'Projects' } },
    { value: aiUseCases.length, label: { id: 'Use Case AI', en: 'AI Use Cases' } },
  ]

  const z = -depth * SPACING
  const tallest = Math.max(...stats.map((s) => s.value))

  return (
    <group>
      {stats.map((s, i) => {
        // Normalised so the largest stat is always the same height; the bars
        // compare against each other rather than against an absolute scale.
        const h = 1.6 + (s.value / tallest) * 6
        return (
          <group key={i} position={[4.4 + i * 2.6, -4 + h / 2, z - 3]}>
            <mesh>
              <boxGeometry args={[1.1, h, 1.1]} />
              <meshBasicMaterial color={ACCENT.cyan} transparent opacity={0.13} />
            </mesh>
            {/* Wireframe over a translucent solid gives an edge without a light rig. */}
            <mesh>
              <boxGeometry args={[1.12, h + 0.02, 1.12]} />
              <meshBasicMaterial color={ACCENT.cyan} wireframe transparent opacity={0.5} />
            </mesh>
          </group>
        )
      })}

      <Panel depth={depth} position={[-6.6, 0.6, -1]} width={560}>
        <h2 className="world-heading">{t({ id: 'Tentang Saya', en: 'About Me' })}</h2>
        <p className="world-body world-body-long">{t(profile.about)}</p>
        <ul className="world-stat-row">
          {stats.map((s, i) => (
            <li key={i}>
              <strong>
                {s.value}
                {i === 0 ? '+' : ''}
              </strong>
              <span>{t(s.label)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  )
}
