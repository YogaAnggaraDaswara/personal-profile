'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '@/content/types'
import { useLang } from '@/lib/i18n'

type Props = {
  project: Project
  prev: Project | null
  next: Project | null
}

const COVER_STYLES: Record<string, string> = {
  ai: 'from-fuchsia-600/40 to-cyan-500/30',
  banking: 'from-violet-600/40 to-blue-500/30',
  web: 'from-cyan-500/40 to-emerald-500/30',
}

export default function ProjectDetailClient({ project, prev, next }: Props) {
  const { t } = useLang()
  const reduce = useReducedMotion()

  const rows = [
    { label: { id: 'Masalah', en: 'Problem' }, body: project.problem, icon: '🔍' },
    { label: { id: 'Solusi', en: 'Solution' }, body: project.solution, icon: '💡' },
    { label: { id: 'Arsitektur', en: 'Architecture' }, body: project.architecture, icon: '🏗️' },
    { label: { id: 'Dampak', en: 'Impact' }, body: project.impact, icon: '📈' },
  ]

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className={`relative flex h-48 items-end bg-gradient-to-br ${COVER_STYLES[project.category] || COVER_STYLES.web} md:h-64`}>
        <div className="absolute inset-0 bg-[var(--bg)]/60" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-8">
          <Link
            href="/#projects"
            className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t({ id: 'Kembali ke Project', en: 'Back to Projects' })}
          </Link>
          <span className="rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/15 px-3 py-1 text-xs font-bold text-[#c4b5fd] uppercase">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-5 py-10">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-white md:text-5xl"
        >
          {project.title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-[var(--muted)]"
        >
          {t(project.summary)}
        </motion.p>

        {/* Detail rows */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="glass p-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{r.icon}</span>
                <h3 className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
                  {t(r.label)}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{t(r.body)}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-sm font-bold text-white">
            {t({ id: 'Teknologi', en: 'Tech Stack' })}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-1.5 text-sm font-medium text-[#67e8f9]"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="max-w-[150px] truncate">{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              <span className="max-w-[150px] truncate">{next.title}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  )
}
