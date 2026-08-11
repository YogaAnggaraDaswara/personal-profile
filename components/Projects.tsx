'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { projects } from '@/content/projects'
import type { Project, ProjectCategory } from '@/content/types'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { useFinePointer } from '@/lib/use-fine-pointer'
import Reveal from './Reveal'
import RevealText from './RevealText'

const COVER_STYLES: Record<ProjectCategory, string> = {
  ai: 'from-fuchsia-600/40 to-cyan-500/30',
  banking: 'from-violet-600/40 to-blue-500/30',
  web: 'from-cyan-500/40 to-emerald-500/30',
}

function ProjectCard({ p }: { p: Project }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const finePointer = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [8, -8])
  const rotateY = useTransform(x, [-60, 60], [-8, 8])

  // Tilt only makes sense with a real pointer. On touch there is no
  // mousemove, so skip the transform and the springs entirely.
  const tilt = finePointer && !reduce

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    /* next/link on the outside, motion.div on the inside.
       A raw <a href="/projects/..."> would force a full page reload
       instead of a client-side transition, and it trips the
       @next/next/no-html-link-for-pages lint rule. Keeping Link as the
       only interactive element also preserves valid HTML: this card was
       previously a <button> with an <a> nested inside it. */
    <Link
      href={`/projects/${p.slug}`}
      onClick={() => trackEvent({ name: 'project_click', properties: { slug: p.slug, title: p.title } })}
      className="block h-full"
    >
      <motion.div
        style={tilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={reduce ? undefined : { y: -6 }}
        className="glass flex h-full w-full flex-col overflow-hidden p-6 text-left transition-shadow hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
      >
        <div
          className={`-mx-6 -mt-6 mb-4 flex h-24 shrink-0 items-center justify-center bg-gradient-to-br ${COVER_STYLES[p.category]} text-3xl font-black tracking-widest text-white/25 uppercase`}
        >
          {p.category}
        </div>
        <span className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
          {p.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-white">{p.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t(p.summary)}</p>

        {/* Spacer keeps the footer row aligned across cards of differing text length */}
        <div className="flex-1" />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px]">
              {tech}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--cyan)]">
          {t({ id: 'Lihat Detail', en: 'View Details' })}
          <span aria-hidden>→</span>
        </span>
      </motion.div>
    </Link>
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

  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="projects-heading">
          <RevealText text={t({ id: 'Project', en: 'Projects' })} /> <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          {t({
            id: 'Buka kartu untuk detail: masalah, solusi, arsitektur, dan dampak.',
            en: 'Open a card for details: problem, solution, architecture, and impact.',
          })}
        </p>
      </Reveal>

      <div
        role="group"
        aria-label={t({ id: 'Filter kategori project', en: 'Filter projects by category' })}
        className="mt-6 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`min-h-11 rounded-full px-4 text-xs font-bold transition-colors ${
              filter === f.key
                ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] text-white'
                : 'glass text-[var(--muted)] hover:text-white'
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={0.06 * i} className="h-full">
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
