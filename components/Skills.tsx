'use client'
import { useLang } from '@/lib/i18n'
import { skillGroups, marqueeTech } from '@/content/skills'
import { certifications } from '@/content/certifications'
import Reveal from './Reveal'
import RevealText from './RevealText'

export default function Skills() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <RevealText text={t({ id: 'Skill & Teknologi', en: 'Skills & Technologies' })} />{' '}
          <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass h-full p-6">
              <h3 className="font-bold text-[var(--cyan)]">{t(g.title)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text)] transition-colors hover:border-[var(--violet)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="marquee-track gap-10">
          {[...marqueeTech, ...marqueeTech].map((tech, i) => (
            <span key={i} className="text-2xl font-extrabold whitespace-nowrap text-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>

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
                  <p className="text-sm font-semibold text-white">{c.title}</p>
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
