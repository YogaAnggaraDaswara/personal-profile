'use client'
import { useLang } from '@/lib/i18n'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-24 border-t border-white/10 py-8 text-center text-xs text-[var(--muted)]">
      <p>
        © {new Date().getFullYear()} Yoga Daswara ·{' '}
        {t({ id: 'Dibangun dengan Next.js', en: 'Built with Next.js' })}
      </p>
    </footer>
  )
}
