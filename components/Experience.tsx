'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { experiences } from '@/content/experience'
import { headings } from '@/content/site'
import Reveal from './Reveal'
import RevealText from './RevealText'

export default function Experience() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  /* Only Edge keywords are used here on purpose. The numeric offset form
     ("start 0.85") is accepted at runtime but its template-literal type
     is fragile across versions, and a type error here fails the build. */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end center'],
  })

  // Spring the raw progress so the line eases instead of tracking the
  // scroll wheel one-to-one, which feels mechanical.
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="experience-heading">
          <RevealText text={t(headings.experience)} />{' '}
          <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div ref={trackRef} className="relative mt-10">
        {/* Dim track: shows the full path ahead of the reader */}
        <div className="absolute top-0 bottom-0 left-5 w-px bg-white/10 md:left-8" />

        {/* Bright line: scales from the top as the section scrolls past */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { scaleY: lineScale }}
          className="absolute top-0 bottom-0 left-5 w-px origin-top bg-gradient-to-b from-[var(--violet)] via-[var(--cyan)] to-[var(--cyan)] md:left-8"
        />

        {experiences.map((e, i) => (
          <Reveal key={i} delay={0.1 * i} className="relative pb-12 pl-14 last:pb-0 md:pl-20">
            {/* Dot pops in as it enters view, so each role lands with the line */}
            <motion.span
              aria-hidden
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="absolute top-1 left-3 h-5 w-5 rounded-full border-2 border-[var(--violet)] bg-[var(--bg)] shadow-[0_0_12px_rgba(139,92,246,0.6)] md:left-6"
            />

            {e.logo && (
              <div className="absolute top-8 left-0.5 h-9 w-9 overflow-hidden rounded-lg md:left-4 md:h-8 md:w-8">
                <Image
                  src={e.logo}
                  alt={`${e.company} logo`}
                  width={36}
                  height={36}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-3 py-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3 w-3 text-[var(--cyan)]"
                aria-hidden
              >
                <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-medium text-[var(--cyan)]">{e.period}</span>
            </div>

            <h3 className="text-xl font-bold text-white">{t(e.role)}</h3>
            <p className="mt-0.5 text-sm font-medium text-[var(--muted)]">{e.company}</p>

            <ul className="mt-3 space-y-2">
              {e.points.map((p, j) => (
                <li key={j} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--violet)]" aria-hidden />
                  {t(p)}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
