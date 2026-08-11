'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { brand, navLinks } from '@/content/site'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Let Escape close the mobile menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function toggleLang() {
    const newLang = lang === 'id' ? 'en' : 'id'
    trackEvent({ name: 'language_switch', properties: { from: lang, to: newLang } })
    setLang(newLang)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50" role="banner">
      <nav
        aria-label="Main navigation"
        style={{ boxShadow: scrolled ? '0 8px 30px rgba(139,92,246,0.25)' : 'none' }}
        className="glass-nav mx-3 mt-3 flex items-center justify-between px-3 py-2 transition-shadow duration-300 md:mx-auto md:max-w-6xl md:px-6"
      >
        <a
          href="#top"
          className="grad-text flex min-h-11 items-center px-1 text-lg font-extrabold tracking-tight"
        >
          {brand.initials}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              {t(l.label)}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="ml-2 min-h-11 rounded-full border border-white/15 px-4 text-xs font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
            aria-label={t({ id: 'Ganti bahasa', en: 'Toggle language' })}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLang}
            className="min-h-11 rounded-full border border-white/15 px-4 text-xs font-bold text-[var(--cyan)]"
            aria-label={t({ id: 'Ganti bahasa', en: 'Toggle language' })}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label={t({ id: 'Menu', en: 'Menu' })}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex size-11 items-center justify-center rounded-lg text-2xl leading-none text-white transition-colors hover:bg-white/10"
          >
            {open ? '\u2715' : '\u2630'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-nav mx-3 mt-2 flex flex-col gap-0.5 p-2 md:hidden"
          >
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-white"
              >
                {t(l.label)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
