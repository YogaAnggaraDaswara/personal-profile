'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Magnetic from './Magnetic'

type Status = 'idle' | 'submitting' | 'ready' | 'error' | 'rate_limited'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--violet)]'

export default function CvGate() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', website: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function close() {
    setOpen(false)
    setStatus('idle')
    setDownloadUrl('')
    setFieldErrors({})
    setForm({ name: '', email: '', phone: '', website: '' })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setFieldErrors({})
    try {
      const res = await fetch('/api/cv-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (res.status === 429) {
        setStatus('rate_limited')
      } else if (res.status === 422) {
        setFieldErrors(json.errors ?? {})
        setStatus('idle')
      } else if (res.ok && json.ok) {
        setDownloadUrl(json.downloadUrl || profile.cvFile)
        setStatus('ready')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const err = (k: string) =>
    fieldErrors[k] && (
      <p className="mt-1 text-xs text-rose-400">
        {t({ id: 'Isian belum valid.', en: 'This field is invalid.' })}
      </p>
    )

  return (
    <>
      <Magnetic className="inline-block" strength={0.3}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="glass inline-block px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          {t({ id: '📄 Unduh CV', en: '📄 Download CV' })}
        </button>
      </Magnetic>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-md p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-extrabold text-white">
                  {t({ id: 'Unduh CV Saya', en: 'Download My CV' })}
                </h3>
                <button
                  onClick={close}
                  className="text-2xl text-[var(--muted)] hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {status === 'ready' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 text-center"
                >
                  <p className="text-4xl">✅</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {t({ id: 'Terima kasih! CV siap diunduh.', en: 'Thanks! Your CV is ready.' })}
                  </p>
                  <a
                    href={downloadUrl}
                    download
                    className="mt-4 inline-block rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
                  >
                    {t({ id: '⬇ Unduh Sekarang', en: '⬇ Download Now' })}
                  </a>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <p className="text-xs text-[var(--muted)]">
                    {t({
                      id: 'Isi data singkat untuk mengunduh CV saya.',
                      en: 'Fill in a few details to download my CV.',
                    })}
                  </p>
                  <div>
                    <input
                      className={inputCls}
                      placeholder={t({ id: 'Nama lengkap *', en: 'Full name *' })}
                      value={form.name}
                      onChange={set('name')}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    {err('name')}
                  </div>
                  <div>
                    <input
                      className={inputCls}
                      type="email"
                      placeholder={t({ id: 'Email *', en: 'Email *' })}
                      value={form.email}
                      onChange={set('email')}
                      required
                      maxLength={200}
                    />
                    {err('email')}
                  </div>
                  <div>
                    <input
                      className={inputCls}
                      type="tel"
                      placeholder={t({ id: 'No. HP / WhatsApp *', en: 'Phone / WhatsApp *' })}
                      value={form.phone}
                      onChange={set('phone')}
                      required
                      maxLength={20}
                    />
                    {err('phone')}
                  </div>

                  <input
                    className="absolute -left-[9999px]"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    placeholder="website"
                    value={form.website}
                    onChange={set('website')}
                  />

                  {status === 'error' && (
                    <p className="text-xs text-rose-400">
                      {t({ id: 'Gagal memproses. Coba lagi.', en: 'Failed to process. Try again.' })}
                    </p>
                  )}
                  {status === 'rate_limited' && (
                    <p className="text-xs text-amber-400">
                      {t({
                        id: 'Terlalu banyak percobaan. Tunggu sebentar.',
                        en: 'Too many attempts. Please wait.',
                      })}
                    </p>
                  )}

                  <button
                    disabled={status === 'submitting'}
                    className="w-full rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                  >
                    {status === 'submitting'
                      ? t({ id: 'Memproses…', en: 'Processing…' })
                      : t({ id: 'Lanjut Unduh', en: 'Continue to Download' })}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
