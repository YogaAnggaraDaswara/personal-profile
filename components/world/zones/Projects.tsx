'use client'
import Link from 'next/link'
import { projects } from '@/content/projects'
import { useLang } from '@/lib/i18n'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * Projects as panels standing in the space, each with a frame the camera passes
 * between. The titles link to the existing DOM detail pages - a case study is a
 * reading task, and dragging a camera around is the wrong interface for reading.
 */
export default function Projects() {
  const { t } = useLang()

  return (
    <group>
      {projects.map((p, i) => {
        // Alternate sides of the corridor so the camera threads between them.
        const side = i % 2 === 0 ? 1 : -1
        return (
          <group key={p.slug} position={[side * 7.2, 0.4 - (i % 3) * 1.2, -1 - i * 2.4]}>
            <mesh rotation={[0, -side * 0.42, 0]}>
              <planeGeometry args={[5.4, 3.2]} />
              <meshBasicMaterial color={ACCENT.emerald} transparent opacity={0.07} />
            </mesh>
            <mesh rotation={[0, -side * 0.42, 0]}>
              <planeGeometry args={[5.44, 3.24]} />
              <meshBasicMaterial color={ACCENT.emerald} wireframe transparent opacity={0.42} />
            </mesh>
          </group>
        )
      })}

      <Panel position={[-5.0, 0.9, -1]} width={400}>
        <h2 className="world-heading">{t({ id: 'Project', en: 'Projects' })}</h2>
        <ul className="world-project-list">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="world-link">
                {p.title}
              </Link>
              <span>{t(p.summary)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  )
}
