'use client'
import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { department, orgUnits } from '@/content/organization'
import type { OrgAccent } from '@/content/types'
import Counter from './Counter'
import OrgMotif from './OrgMotif'
import Reveal from './Reveal'
import RevealText from './RevealText'

/* Mirrors --cyan / --violet / --emerald in globals.css. Duplicated as literals
   because framer-motion interpolates between two parsed colors and cannot read
   a CSS custom property mid-transition. Keep both sides in sync. */
const ACCENT_HEX: Record<OrgAccent, string> = {
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  emerald: '#34d399',
}

export default function OrgStructure() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Track this section from the moment it enters the viewport until it leaves,
  // so the theme has the whole scroll-through to travel across three accents.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // The three units own three thirds of the scroll. The section background
  // drifts cyan -> violet -> emerald so scrolling the department reads as
  // moving through its disciplines rather than past three static cards.
  const accent = useTransform(
    scrollYProgress,
    [0.15, 0.4, 0.65, 0.9],
    [ACCENT_HEX.cyan, ACCENT_HEX.cyan, ACCENT_HEX.violet, ACCENT_HEX.emerald],
  )
  const glowY = useTransform(scrollYProgress, [0, 1], ['12%', '88%'])
  const glow = useMotionTemplate`radial-gradient(60% 45% at 50% ${glowY}, ${accent}26, transparent 72%)`

  // A spring keeps the rail from snapping frame-to-frame with the wheel.
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const railFill = useMotionTemplate`linear-gradient(to bottom, ${accent}, transparent)`

  const totalHeadcount = orgUnits.reduce((sum, u) => sum + u.headcount, 0)

  return (
    <div ref={ref} className="relative">
      {/* Travelling glow. Sits behind everything, ignores pointer events, and
          is skipped entirely under reduced motion since its only job is the
          scroll-linked colour shift. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-16 -z-10"
          style={{ background: glow }}
        />
      )}

      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="org-heading">
          <RevealText text={t({ id: 'Departemen yang Saya Pimpin', en: 'The Department I Lead' })} />{' '}
          <span className="grad-text">.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {t(department.summary)}
        </p>
      </Reveal>

      {/* Department node - the box every branch below hangs from. */}
      <Reveal delay={0.08}>
        <div className="glass relative mt-8 overflow-hidden p-5 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <p className="text-[11px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
            {t(department.role)}
          </p>
          <h3 className="grad-text mt-2 text-xl font-extrabold md:text-2xl">
            {t(department.name)}
          </h3>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
            <span>
              <strong className="text-base font-extrabold text-white">{orgUnits.length}</strong>{' '}
              {t({ id: 'bagian', en: 'units' })}
            </span>
            <span>
              <strong className="text-base font-extrabold text-white">{totalHeadcount}</strong>{' '}
              {t({ id: 'engineer', en: 'engineers' })}
            </span>
          </div>
        </div>
      </Reveal>

      <div className="relative mt-6 pl-8 md:pl-12">
        {/* The spine. Drawn with scaleY from the top so it grows downward as
            the reader scrolls, the same shape as the org chart it came from. */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-[7px] h-full w-px bg-white/10 md:left-[11px]"
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-[7px] h-full w-px origin-top md:left-[11px]"
          style={{ background: railFill, scaleY: reduce ? 1 : railScale }}
        />

        <ul className="space-y-6 md:space-y-8">
          {orgUnits.map((unit, i) => (
            <li key={unit.key} className="relative">
              {/* Branch stub + node, matching the chart's elbow connectors. */}
              <span
                aria-hidden="true"
                className="absolute top-8 -left-8 h-px w-6 bg-white/15 md:-left-12 md:w-9"
              />
              <span
                aria-hidden="true"
                className="absolute top-[29px] -left-[35px] h-2.5 w-2.5 rounded-full md:-left-[51px]"
                style={{
                  background: `var(--${unit.accent})`,
                  // First shadow is an opaque collar in the page background so
                  // the node reads as sitting on top of the spine rather than
                  // being crossed by it; second is the accent glow.
                  boxShadow: `0 0 0 4px var(--bg), 0 0 14px var(--${unit.accent})`,
                }}
              />

              <Reveal delay={reduce ? 0 : 0.06 * i}>
                <article
                  className="glass relative overflow-hidden p-5 transition-transform duration-300 md:p-7"
                  style={{ borderColor: `color-mix(in srgb, var(--${unit.accent}) 34%, transparent)` }}
                >
                  <OrgMotif id={unit.key} accent={unit.accent} />

                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        className="text-lg font-extrabold md:text-xl"
                        style={{ color: `var(--${unit.accent})` }}
                      >
                        {t(unit.name)}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                        {t(unit.focus)}
                      </p>
                    </div>

                    {/* Headcount only, never names - see content/organization.ts.
                        Zero means the number is intentionally not published. */}
                    {unit.headcount > 0 && (
                      <div className="shrink-0 text-right">
                        <Counter to={unit.headcount} />
                        <p className="text-[11px] tracking-wider text-[var(--muted)] uppercase">
                          {t({ id: 'Anggota', en: 'Members' })}
                        </p>
                      </div>
                    )}
                  </div>

                  <ul className="relative mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {unit.scope.map((s, si) => (
                      <li
                        key={si}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-[var(--muted)]"
                      >
                        {t(s)}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
