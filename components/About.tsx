'use client'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { aiUseCases } from '@/content/aiUseCases'
import { testimonials } from '@/content/testimonials'
import { education } from '@/content/education'
import { moments } from '@/content/moments'
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

      <Reveal delay={0.2} className="mt-8">
        <div className="glass overflow-hidden">
          <img
            src="/photos/yoga-presentasi.jpeg"
            alt="Yoga membawakan sesi internal Secure by Design"
            className="h-56 w-full object-cover object-top md:h-72"
          />
          <p className="p-4 text-sm text-[var(--muted)]">
            {t({
              id: 'Membawakan sesi internal "Secure by Design" untuk tim engineering.',
              en: 'Leading an internal "Secure by Design" session for the engineering team.',
            })}
          </p>
        </div>
      </Reveal>

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
                  <span className="font-normal text-[var(--muted)]">- {t(tst.role)}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mt-10">
          <Reveal>
            <h3 className="text-lg font-bold text-white">
              {t({ id: 'Pendidikan', en: 'Education' })}
            </h3>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {education.map((e, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="glass p-4">
                  <p className="text-sm font-semibold text-white">{e.school}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {e.degree} · {e.period}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {moments.length > 0 && (
        <div className="mt-10">
          <Reveal>
            <h3 className="text-lg font-bold text-white">
              {t({ id: 'Momen', en: 'Moments' })}
            </h3>
          </Reveal>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
            {moments.map((m, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="glass overflow-hidden">
                  <img src={m.src} alt={t(m.caption)} className="h-32 w-full object-cover" />
                  <p className="p-2 text-xs text-[var(--muted)]">{t(m.caption)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
