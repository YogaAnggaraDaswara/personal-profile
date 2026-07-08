'use client'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { aiUseCases } from '@/content/aiUseCases'
import { testimonials } from '@/content/testimonials'
import type { Stat } from '@/content/types'
import Reveal from './Reveal'
import RevealText from './RevealText'
import Counter from './Counter'

const stats: Stat[] = [
  ...profile.stats,
  { value: projects.length, suffix: '+', label: { id: 'Project Dikembangkan', en: 'Projects Delivered' } },
  { value: aiUseCases.length, suffix: '+', label: { id: 'Use Case AI', en: 'AI Use Cases' } },
]

export default function About() {
  const { t } = useLang()
  const [src, setSrc] = useState('/profile.png')

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <RevealText text={t({ id: 'Tentang Saya', en: 'About Me' })} /> <span className="grad-text">.</span>
        </h2>
      </Reveal>
      <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
        <Reveal delay={0.1} className="shrink-0">
          <img
            src={src}
            onError={() => setSrc('/profile-placeholder.svg')}
            alt=""
            className="glass h-28 w-28 rounded-2xl object-cover object-top"
          />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-2xl leading-relaxed text-[var(--muted)]">{t(profile.about)}</p>
        </Reveal>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass p-6 text-center">
              <Counter to={s.value} suffix={s.suffix} />
              <p className="mt-2 text-sm text-[var(--muted)]">{t(s.label)}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {testimonials.length > 0 && (
        <div className="mt-10 space-y-4">
          {testimonials.map((tst, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <blockquote className="glass border-l-4 border-[var(--violet)] p-6">
                <p className="text-sm leading-relaxed text-[var(--muted)] italic">
                  &ldquo;{t(tst.quote)}&rdquo;
                </p>
                <footer className="mt-3 text-sm font-semibold text-white">
                  {tst.name}{' '}
                  <span className="font-normal text-[var(--muted)]">— {t(tst.role)}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
