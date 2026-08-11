'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '@/content/types'
import { useLang } from '@/lib/i18n'
import Footer from '@/components/Footer'

type Props = {
  project: Project
  prev: Project | null
  next: Project | null
}

const ACCENT: Record<string, string> = {
  ai: 'from-fuchsia-500 to-cyan-400',
  banking: 'from-violet-500 to-blue-400',
  web: 'from-cyan-400 to-emerald-400',
}

export default function ProjectDetailClient({ project, prev, next }: Props) {
  const { t, lang, setLang } = useLang()
  const reduce = useReducedMotion()

  const rows = [
    { label: { id: 'Masalah', en: 'Problem' }, body: project.problem, icon: '🔍' },
    { label: { id: 'Solusi', en: 'Solution' }, body: project.solution, icon: '💡' },
    { label: { id: 'Arsitektur', en: 'Architecture' }, body: project.architecture, icon: '🏗️' },
    { label: { id: 'Dampak', en: 'Impact' }, body: project.impact, icon: '📈' },
  ]

  const accent = ACCENT[project.category] || ACCENT.web

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {/* Slim header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg)]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link href="/" className="grad-text text-lg font-extrabold tracking-tight">
            YAD
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">
                {t({ id: 'Semua Project', en: 'All Projects' })}
              </span>
            </Link>
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
              aria-label="Toggle language"
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 pt-10 pb-16 md:pt-14">
          {/* Category badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className={`inline-block rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-[11px] font-bold tracking-widest text-white uppercase`}
            >
              {project.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
          >
            {project.title}
          </motion.h1>

          {/* Accent underline */}
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`mt-5 h-1 w-24 origin-left rounded-full bg-gradient-to-r ${accent}`}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg"
          >
            {t(project.summary)}
          </motion.p>

          {/* Detail rows */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6">
            {rows.map((r, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="glass flex flex-col p-5 md:p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.icon}</span>
                  <h2 className="text-[11px] font-bold tracking-widest text-[var(--cyan)] uppercase">
                    {t(r.label)}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{t(r.body)}</p>
              </motion.div>
            ))}
          </div>

          {/* Tech stack */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10"
          >
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">
              {t({ id: 'Teknologi', en: 'Tech Stack' })}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-3.5 py-1.5 text-xs font-medium text-[#67e8f9] md:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Prev / Next navigation */}
          <nav
            aria-label="Project navigation"
            className="mt-14 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="glass group flex flex-col gap-1 p-4 transition-colors hover:bg-white/10"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 transition-transform group-hover:-translate-x-1">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t({ id: 'Sebelumnya', en: 'Previous' })}
                </span>
                <span className="text-sm font-semibold text-white">{prev.title}</span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="glass group flex flex-col gap-1 p-4 transition-colors hover:bg-white/10 sm:items-end sm:text-right"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                  {t({ id: 'Selanjutnya', en: 'Next' })}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-white">{next.title}</span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  )
}
