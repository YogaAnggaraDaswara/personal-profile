'use client'
import { useLang } from '@/lib/i18n'
import { skillGroups, marqueeTech } from '@/content/skills'
import { certifications } from '@/content/certifications'
import { skillLevels, headings } from '@/content/site'
import type { SkillLevelKey } from '@/content/site'
import Reveal from './Reveal'
import RevealText from './RevealText'
import VelocityMarquee from './VelocityMarquee'

export default function Skills() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl" id="skills-heading">
          <RevealText text={t(headings.skills)} />{' '}
          <span className="grad-text">.</span>
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          {(Object.keys(skillLevels) as SkillLevelKey[]).map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${skillLevels[key].dotClass}`} />
              {skillLevels[key].label}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={i} delay={0.1 * i} className="h-full">
            <div className="glass h-full p-4 md:p-6">
              <h3 className="font-bold text-[var(--cyan)]">{t(g.title)}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
                {g.items.map((s) => (
                  <span
                    key={s.name}
                    className={`rounded-full border px-2 py-0.5 text-[10px] transition-colors hover:border-[var(--cyan)] md:px-3 md:py-1 md:text-xs ${skillLevels[s.level].badgeClass}`}
                    title={skillLevels[s.level].label}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <VelocityMarquee items={marqueeTech} className="mt-12" />

      {certifications.length > 0 && (
        <div className="mt-12">
          <Reveal>
            <h3 className="text-lg font-bold text-white">
              {t({ id: 'Sertifikasi', en: 'Certifications' })}
            </h3>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal key={i} delay={0.05 * i} className="h-full">
                <div className="glass h-full p-4">
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white transition-colors hover:text-[var(--cyan)]"
                    >
                      {c.title} <span className="text-[var(--cyan)]">&#x2197;</span>
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                  )}
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {c.issuer}
                    {c.year ? ` \u00B7 ${c.year}` : ''}
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
