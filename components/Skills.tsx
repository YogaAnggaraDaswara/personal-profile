'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { skillGroups, marqueeTech } from '@/content/skills'
import { certifications } from '@/content/certifications'
import Reveal from './Reveal'
import RevealText from './RevealText'

const LEVEL_COLORS: Record<string, string> = {
  expert: 'border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]',
  advanced: 'border-[var(--violet)] bg-[var(--violet)]/10 text-[#c4b5fd]',
  intermediate: 'border-white/20 bg-white/5 text-[var(--muted)]',
}

const LEVEL_DOT: Record<string, string> = {
  expert: 'bg-[var(--cyan)]',
  advanced: 'bg-[var(--violet)]',
  intermediate: 'bg-white/30',
}

function TechScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-50px' })
  const reduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (reduce) {
    return (
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {marqueeTech.map((tech) => (
          <span
            key={tech}
            className="rounded-xl border border-[var(--violet)]/30 bg-[var(--violet)]/5 px-4 py-2 text-sm font-bold text-white/80"
          >
            {tech}
          </span>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mt-10 flex flex-wrap justify-center gap-3"
    >
      {marqueeTech.map((tech, i) => (
        <motion.span
          key={tech}
          variants={itemVariants}
          whileHover={{
            scale: 1.15,
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            borderColor: 'rgba(34,211,238,0.7)',
          }}
          className="cursor-default rounded-xl border border-[var(--violet)]/30 bg-gradient-to-br from-[var(--violet)]/10 to-[var(--cyan)]/5 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-sm transition-colors"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {tech}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default function Skills() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="skills-heading">
          <RevealText text={t({ id: 'Skill & Teknologi', en: 'Skills & Technologies' })} />{' '}
          <span className="grad-text">.</span>
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${LEVEL_DOT.expert}`} />
            Expert
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${LEVEL_DOT.advanced}`} />
            Advanced
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${LEVEL_DOT.intermediate}`} />
            Intermediate
          </span>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass h-full p-4 md:p-6">
              <h3 className="font-bold text-[var(--cyan)]">{t(g.title)}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
                {g.items.map((s) => (
                  <span
                    key={s.name}
                    className={`rounded-full border px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs transition-colors hover:border-[var(--cyan)] ${LEVEL_COLORS[s.level]}`}
                    title={s.level}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <TechScrollAnimation />

      {certifications.length > 0 && (
        <div className="mt-12">
          <Reveal>
            <h3 className="text-lg font-bold text-white">
              {t({ id: 'Sertifikasi', en: 'Certifications' })}
            </h3>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="glass p-4">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-[var(--cyan)] transition-colors">
                      {c.title} <span className="text-[var(--cyan)]">↗</span>
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                  )}
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {c.issuer}
                    {c.year ? ` · ${c.year}` : ''}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
