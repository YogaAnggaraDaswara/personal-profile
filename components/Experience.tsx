'use client'
import Image from 'next/image'
import { useLang } from '@/lib/i18n'
import { experiences } from '@/content/experience'
import Reveal from './Reveal'
import RevealText from './RevealText'

export default function Experience() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="experience-heading">
          <RevealText text={t({ id: 'Pengalaman Kerja', en: 'Work Experience' })} /> <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div className="relative mt-10">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--violet)] via-[var(--cyan)] to-transparent md:left-8" />

        {experiences.map((e, i) => (
          <Reveal key={i} delay={0.1 * i} className="relative pb-12 last:pb-0 pl-14 md:pl-20">
            {/* Timeline dot */}
            <span className="absolute left-3 top-1 h-5 w-5 rounded-full border-2 border-[var(--violet)] bg-[var(--bg)] shadow-[0_0_12px_rgba(124,58,237,0.6)] md:left-6" />

            {/* Company logo */}
            {e.logo && (
              <div className="absolute left-0.5 top-8 h-9 w-9 overflow-hidden rounded-lg md:left-4 md:h-8 md:w-8">
                <Image
                  src={e.logo}
                  alt={`${e.company} logo`}
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* Period badge */}
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-3 py-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-[var(--cyan)]">
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
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--violet)]" />
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
