'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { projects } from '@/content/projects'
import type { Project, ProjectCategory } from '@/content/types'
import { projectCategories, headings } from '@/content/site'
import type { ProjectCategoryKey } from '@/content/site'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { useFinePointer } from '@/lib/use-fine-pointer'
import Reveal from './Reveal'
import RevealText from './RevealText'

function ProjectCard({ p }: { p: Project }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const finePointer = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [8, -8])
  const rotateY = useTransform(x, [-60, 60], [-8, 8])

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

  const coverGradient = projectCategories[p.category].coverGradient

  return (
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
          className={`-mx-6 -mt-6 mb-4 flex h-24 shrink-0 items-center justify-center bg-gradient-to-br ${coverGradient} text-3xl font-black tracking-widest text-white/25 uppercase`}
        >
          {p.category}
        </div>
        <span className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
          {p.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-white">{p.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t(p.summary)}</p>

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
          <span aria-hidden>&rarr;</span>
        </span>
      </motion.div>
    </Link>
  )
}

// Derive filter buttons from projectCategories config — adding a new
// category in site.ts automatically creates the filter button here.
const categoryKeys = Object.keys(projectCategories) as ProjectCategoryKey[]

export default function Projects() {
  const { t } = useLang()
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')

  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="projects-heading">
          <RevealText text={t(headings.projects)} /> <span className="grad-text">.</span>
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
        <button
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`min-h-11 rounded-full px-4 text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] text-white'
              : 'glass text-[var(--muted)] hover:text-white'
          }`}
        >
          {t({ id: 'Semua', en: 'All' })}
        </button>
        {categoryKeys.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`min-h-11 rounded-full px-4 text-xs font-bold transition-colors ${
              filter === key
                ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] text-white'
                : 'glass text-[var(--muted)] hover:text-white'
            }`}
          >
            {t(projectCategories[key].label)}
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
