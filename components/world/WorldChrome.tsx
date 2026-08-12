'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { PLACES, WORLD_SCREENS } from './theme'

const PLACE_LABELS: Record<string, { id: string; en: string }> = {
  arrival: { id: 'Mulai', en: 'Start' },
  about: { id: 'Tentang', en: 'About' },
  department: { id: 'Tim', en: 'Team' },
  skills: { id: 'Skill', en: 'Skills' },
  experience: { id: 'Pengalaman', en: 'Experience' },
  projects: { id: 'Project', en: 'Projects' },
  ai: { id: 'AI', en: 'AI' },
  gate: { id: 'Kontak', en: 'Contact' },
}

/**
 * The flat controls that sit over the world: place navigation, language, and the
 * escape hatch to the text version.
 *
 * Navigation scrolls the window rather than moving the camera directly, so it
 * goes through the same path as a wheel gesture and the two can never disagree
 * about where the camera is.
 */
export default function WorldChrome() {
  const { lang, setLang, t } = useLang()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      setActive(Math.round(progress * (PLACES.length - 1)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function goTo(index: number) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: (index / (PLACES.length - 1)) * scrollable, behavior: 'smooth' })
  }

  function toggleLang() {
    const next = lang === 'id' ? 'en' : 'id'
    trackEvent({ name: 'language_switch', properties: { from: lang, to: next } })
    setLang(next)
  }

  return (
    <>
      <header className="world-chrome-top" role="banner">
        <Link href="/" className="grad-text world-mark">
          YAD
        </Link>
        <div className="world-chrome-actions">
          <Link href="/text" className="world-chrome-btn">
            {t({ id: 'Versi teks', en: 'Text version' })}
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            className="world-chrome-btn"
            aria-label={t({ id: 'Ganti bahasa', en: 'Toggle language' })}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>
      </header>

      <nav className="world-rail" aria-label={t({ id: 'Navigasi tempat', en: 'Place navigation' })}>
        <ol>
          {PLACES.map((place, i) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? 'true' : undefined}
                className={i === active ? 'is-active' : undefined}
              >
                <span className="world-rail-dot" aria-hidden="true" />
                <span className="world-rail-label">{t(PLACE_LABELS[place.id])}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* The scrollbar needs something tall to scroll. It carries no content -
          the content lives in the world's panels and on /text. */}
      <div
        className="world-scroll-space"
        style={{ height: `${WORLD_SCREENS * 100}vh` }}
        aria-hidden="true"
      />
    </>
  )
}
