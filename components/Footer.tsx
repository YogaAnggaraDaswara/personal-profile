'use client'
import { useLang } from '@/lib/i18n'
import { footer } from '@/content/site'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-16 border-t border-white/10 px-5 py-8 text-center text-xs text-[var(--muted)] md:mt-24" role="contentinfo">
      <SocialLinks className="mb-4 flex justify-center gap-3" />
      <p>
        &copy; {new Date().getFullYear()} {footer.copyright} &middot;{' '}
        {t(footer.tagline)}
      </p>
    </footer>
  )
}
