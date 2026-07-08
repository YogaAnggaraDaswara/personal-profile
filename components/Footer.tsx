'use client'
import { useLang } from '@/lib/i18n'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-24 border-t border-white/10 py-8 text-center text-xs text-[var(--muted)]">
      <SocialLinks className="mb-4 flex justify-center gap-3" />
      <p>
        © {new Date().getFullYear()} Yoga Daswara ·{' '}
        {t({ id: 'Dibangun dengan Ai', en: 'Built with Ai' })}
      </p>
    </footer>
  )
}
