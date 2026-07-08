'use client'
import { aiUseCases } from '@/content/aiUseCases'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'
import RevealText from './RevealText'

export default function AiUseCases() {
  const { t } = useLang()
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--violet)]/20 blur-[100px]" />
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <RevealText text={t({ id: 'Use Case AI', en: 'AI Use Cases' })} /> <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          {t({
            id: 'Implementasi AI yang saya bangun dan jalankan - selalu dengan manusia dalam proses.',
            en: 'AI implementations I build and run - always with a human in the loop.',
          })}
        </p>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {aiUseCases.map((u, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass relative h-full overflow-hidden p-6">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)]" />
              <h3 className="font-bold text-white">{t(u.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t(u.description)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {u.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--cyan)]/30 px-2.5 py-0.5 text-[10px] text-[#67e8f9]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
