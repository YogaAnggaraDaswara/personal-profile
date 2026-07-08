'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n'

const LINKS = [
  { href: '#about', label: { id: 'Tentang', en: 'About' } },
  { href: '#skills', label: { id: 'Skill', en: 'Skills' } },
  { href: '#experience', label: { id: 'Pengalaman', en: 'Experience' } },
  { href: '#projects', label: { id: 'Project', en: 'Projects' } },
  { href: '#ai', label: { id: 'AI', en: 'AI' } },
  { href: '#contact', label: { id: 'Kontak', en: 'Contact' } },
]

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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        style={{ boxShadow: scrolled ? '0 8px 30px rgba(124,58,237,0.25)' : 'none' }}
        className="glass mx-auto mt-3 flex max-w-5xl items-center justify-between px-4 py-2.5 transition-shadow duration-300 md:px-6"
      >
        <a href="#top" className="grad-text text-lg font-extrabold tracking-tight">
          YD<span className="text-[var(--cyan)]">.</span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              {t(l.label)}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
            aria-label="Toggle language"
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-[var(--cyan)]"
            aria-label="Toggle language"
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl leading-none text-white"
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-3 mt-2 flex flex-col gap-1 p-3 md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-white"
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
