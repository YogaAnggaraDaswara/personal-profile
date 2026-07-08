'use client'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Particles from './Particles'
import Magnetic from './Magnetic'

function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState(enabled ? '' : words[0])
  useEffect(() => {
    if (!enabled) return
    let w = 0
    let i = 0
    let del = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const word = words[w]
      i = del ? i - 1 : i + 1
      setText(word.slice(0, i))
      let delay = del ? 40 : 90
      if (!del && i === word.length) {
        del = true
        delay = 1600
      } else if (del && i === 0) {
        del = false
        w = (w + 1) % words.length
        delay = 300
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [words, enabled])
  return text
}

export default function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const typed = useTypewriter(profile.typingRoles, !reduce)
  const [src, setSrc] = useState('/profile.jpg')

  return (
    <div className="relative flex min-h-[92vh] items-center overflow-hidden">
      <Particles />
      <motion.div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--violet)]/25 blur-[120px]"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-[var(--cyan)]/20 blur-[120px]"
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-5 md:flex-row md:justify-between">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl text-center md:text-left"
        >
          <p className="text-sm tracking-[0.3em] text-[var(--cyan)] uppercase">
            {t({ id: 'Halo, saya', en: 'Hi, I am' })}
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight md:text-7xl">
            <span className="grad-text">{profile.name}</span>
          </h1>
          <p className="mt-4 h-8 text-xl font-semibold text-white md:text-2xl">
            {typed}
            <span className="animate-pulse text-[var(--cyan)]">|</span>
          </p>
          <p className="mt-4 text-[var(--muted)]">{t(profile.tagline)}</p>
          <div className="mt-8 flex justify-center gap-4 md:justify-start">
            <Magnetic className="inline-block">
              <a
                href="#projects"
                className="inline-block rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                {t({ id: 'Lihat Project', en: 'View Projects' })}
              </a>
            </Magnetic>
            <Magnetic className="inline-block">
              <a
                href="#contact"
                className="glass inline-block px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                {t({ id: 'Hubungi Saya', en: 'Contact Me' })}
              </a>
            </Magnetic>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          whileHover={reduce ? undefined : { rotate: 2, scale: 1.03 }}
          className="glow-ring shadow-[0_0_60px_rgba(124,58,237,0.45)]"
        >
          <img
            src={src}
            onError={() => setSrc('/profile-placeholder.svg')}
            alt="Foto Yoga Daswara"
            className="h-48 w-48 rounded-full bg-[var(--bg-soft)] object-cover md:h-64 md:w-64"
          />
        </motion.div>
      </div>
    </div>
  )
}
