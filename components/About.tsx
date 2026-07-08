'use client'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Reveal from './Reveal'
import RevealText from './RevealText'
import Counter from './Counter'

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
        {profile.stats.map((s, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass p-6 text-center">
              <Counter to={s.value} suffix={s.suffix} />
              <p className="mt-2 text-sm text-[var(--muted)]">{t(s.label)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
