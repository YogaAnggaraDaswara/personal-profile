'use client'
import { useLang } from '@/lib/i18n'
import { experiences } from '@/content/experience'
import Reveal from './Reveal'
import RevealText from './RevealText'

export default function Experience() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <RevealText text={t({ id: 'Pengalaman Kerja', en: 'Work Experience' })} /> <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div className="relative mt-10 ml-3 border-l border-white/10 pl-8 md:ml-6">
        {experiences.map((e, i) => (
          <Reveal key={i} delay={0.1 * i} className="relative pb-12 last:pb-0">
            <span className="absolute top-1 -left-[41px] h-4 w-4 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] shadow-[0_0_16px_rgba(124,58,237,0.8)] md:-left-[41px]" />
            <p className="text-xs tracking-widest text-[var(--cyan)] uppercase">{e.period}</p>
            <h3 className="mt-1 text-xl font-bold text-white">{t(e.role)}</h3>
            <p className="text-sm text-[var(--muted)]">{e.company}</p>
            <ul className="mt-3 space-y-2">
              {e.points.map((p, j) => (
                <li key={j} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-[var(--violet)]">▸</span>
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
