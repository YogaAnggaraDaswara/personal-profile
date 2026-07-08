'use client'
import { useState } from 'react'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { projects } from '@/content/projects'
import type { Project, ProjectCategory } from '@/content/types'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'
import RevealText from './RevealText'
import ProjectModal from './ProjectModal'

function ProjectCard({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [10, -10])
  const rotateY = useTransform(x, [-60, 60], [-10, 10])

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      onClick={() => onOpen(p)}
      className="glass block h-full w-full p-6 text-left transition-shadow hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]"
    >
      <span className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
        {p.category}
      </span>
      <h3 className="mt-2 text-lg font-bold text-white">{p.title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{t(p.summary)}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.tech.slice(0, 3).map((tech) => (
          <span key={tech} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px]">
            {tech}
          </span>
        ))}
      </div>
    </motion.button>
  )
}

const FILTERS: { key: ProjectCategory | 'all'; label: { id: string; en: string } }[] = [
  { key: 'all', label: { id: 'Semua', en: 'All' } },
  { key: 'ai', label: { id: 'AI', en: 'AI' } },
  { key: 'banking', label: { id: 'Banking', en: 'Banking' } },
  { key: 'web', label: { id: 'Web', en: 'Web' } },
]

export default function Projects() {
  const { t } = useLang()
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')
  const [active, setActive] = useState<Project | null>(null)

  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <RevealText text={t({ id: 'Project', en: 'Projects' })} /> <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t({
            id: 'Klik kartu untuk detail: masalah, solusi, arsitektur, dampak.',
            en: 'Click a card for details: problem, solution, architecture, impact.',
          })}
        </p>
      </Reveal>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              filter === f.key
                ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] text-white'
                : 'glass text-[var(--muted)] hover:text-white'
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={0.06 * i}>
            <ProjectCard p={p} onOpen={setActive} />
          </Reveal>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  )
}
