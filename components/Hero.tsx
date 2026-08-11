'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Particles from './Particles'
import Magnetic from './Magnetic'
import CvGate from './CvGate'
import SocialLinks from './SocialLinks'

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
  const [src, setSrc] = useState(profile.photo)

  /* Parallax: the copy drifts up faster than the portrait, so the two
     planes separate as you scroll away and the hero gains depth. */
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, 70])
  const contentOpacity = useTransform(scrollY, [120, 560], [1, 0])
  const portraitY = useTransform(scrollY, [0, 600], [0, 32])

  return (
    /* svh instead of vh: on mobile Safari/Chrome, vh includes the area
       under the address bar, so a vh-sized hero gets visually clipped.
       min-h-svh fills the full visible viewport. */
    <div className="relative flex min-h-[88svh] items-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">
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

      {/* Large edge-bleed portrait, desktop only.
          The mask-image creates a smooth left-edge fade so the portrait
          blends into the background instead of showing a hard edge. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={reduce ? undefined : { y: portraitY }}
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[46%] md:block"
      >
        <Image
          src={src}
          onError={() => setSrc(profile.photoFallback)}
          alt={`${profile.name} portrait`}
          fill
          priority
          sizes="(max-width: 768px) 0vw, 46vw"
          className="object-cover object-top"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
          }}
        />
      </motion.div>

      {/* Content container: max-w-6xl + px-5/md:px-6 matches the navbar
          and section-shell gutters so everything aligns on the same grid. */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-6"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-xl text-center md:mx-0 md:max-w-[min(46%,36rem)] md:text-left"
        >
          {/* Compact circular avatar on mobile */}
          <div className="mb-6 flex justify-center md:hidden">
            <div className="glow-ring">
              <Image
                src={src}
                onError={() => setSrc(profile.photoFallback)}
                alt={`${profile.name} portrait`}
                width={112}
                height={112}
                priority
                className="size-28 rounded-full bg-[var(--bg-soft)] object-cover object-top"
              />
            </div>
          </div>

          <p className="text-xs tracking-[0.3em] text-[var(--cyan)] uppercase sm:text-sm">
            {t({ id: 'Halo, saya', en: 'Hi, I am' })}
          </p>
          <h1 className="mt-3 text-[clamp(1.9rem,7vw,3rem)] leading-[1.1] font-extrabold tracking-tight md:text-[clamp(2.5rem,5vw,4.5rem)]">
            <span className="grad-text">{profile.name}</span>
          </h1>
          <p className="mt-4 min-h-8 text-lg font-semibold text-white sm:text-xl md:text-2xl">
            {typed}
            <span className="animate-pulse text-[var(--cyan)]">|</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {t(profile.tagline)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#projects"
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 text-sm font-bold text-white transition-transform hover:scale-105 sm:w-auto"
              >
                {t({ id: 'Lihat Project', en: 'View Projects' })}
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#contact"
                className="glass flex min-h-12 w-full items-center justify-center px-6 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                {t({ id: 'Hubungi Saya', en: 'Contact Me' })}
              </a>
            </Magnetic>
            <CvGate />
          </div>

          <SocialLinks className="mt-6 flex justify-center gap-3 md:justify-start" />
        </motion.div>
      </motion.div>
    </div>
  )
}
