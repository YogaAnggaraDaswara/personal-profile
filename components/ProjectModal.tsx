'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Project } from '@/content/types'
import { useLang } from '@/lib/i18n'

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const { t } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = project
    ? [
        { label: { id: 'Masalah', en: 'Problem' }, body: project.problem },
        { label: { id: 'Solusi', en: 'Solution' }, body: project.solution },
        { label: { id: 'Arsitektur', en: 'Architecture' }, body: project.architecture },
        { label: { id: 'Dampak', en: 'Impact' }, body: project.impact },
      ]
    : []

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl p-6 sm:rounded-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/15 px-3 py-1 text-xs font-bold text-[#c4b5fd] uppercase">
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-white">{project.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-[var(--muted)] hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {rows.map((r, i) => (
              <div key={i} className="mt-5">
                <p className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
                  {t(r.label)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{t(r.body)}</p>
              </div>
            ))}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
