'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'

type Status = 'idle' | 'submitting' | 'revealed' | 'thanks' | 'error' | 'rate_limited'
type Contact = { email: string; whatsapp: string }

const PURPOSE_OPTIONS = [
  { value: 'recruitment', label: { id: 'Rekrutmen', en: 'Recruitment' } },
  { value: 'collaboration', label: { id: 'Kolaborasi Project', en: 'Project Collaboration' } },
  { value: 'consultation', label: { id: 'Konsultasi', en: 'Consultation' } },
  { value: 'other', label: { id: 'Lainnya', en: 'Other' } },
]

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--violet)]'

export default function ContactGate() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<Status>('idle')
  const [contact, setContact] = useState<Contact | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    purpose: 'recruitment',
    message: '',
    website: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setFieldErrors({})
    try {
      const res = await fetch('/api/contact', {
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
        if (json.contact) {
          setContact(json.contact)
          setStatus('revealed')
        } else {
          setStatus('thanks')
        }
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
    <div className="relative">
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Hubungi Saya', en: 'Get In Touch' })} <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          {t({
            id: 'Isi form singkat ini — setelah terkirim, email & WhatsApp saya langsung terbuka untukmu.',
            en: 'Fill this short form — once submitted, my email & WhatsApp unlock instantly.',
          })}
        </p>
      </Reveal>

      <div className="mx-auto mt-10 max-w-xl">
        <AnimatePresence>
          {status === 'revealed' && contact ? (
            <motion.div
              key="revealed"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 18 }}
              className="glass relative overflow-hidden p-8 text-center"
            >
              {!reduce &&
                Array.from({ length: 20 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      x: (i % 2 ? 1 : -1) * (30 + (i * 13) % 120),
                      y: -60 - ((i * 17) % 140),
                      rotate: (i * 47) % 360,
                    }}
                    transition={{ duration: 1.4, delay: 0.05 * i, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 text-lg"
                  >
                    {['✦', '✧', '⚡'][i % 3]}
                  </motion.span>
                ))}
              <p className="text-4xl">🎉</p>
              <h3 className="mt-3 text-xl font-extrabold text-white">
                {t({ id: 'Terhubung! Ini kontak saya:', en: 'Connected! Here is my contact:' })}
              </h3>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="glass px-6 py-3 text-sm font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
                >
                  ✉ {contact.email}
                </a>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
                  >
                    {t({ id: 'Chat WhatsApp Sekarang', en: 'Chat on WhatsApp Now' })}
                  </a>
                )}
              </div>
            </motion.div>
          ) : status === 'thanks' ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 text-center text-sm text-[var(--muted)]"
            >
              {t({ id: 'Terima kasih, pesanmu sudah diterima.', en: 'Thanks, your message was received.' })}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={false}
              exit={{ opacity: 0, y: -12 }}
              className="glass space-y-4 p-6 md:p-8"
            >
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
                  placeholder={t({ id: 'Email kamu *', en: 'Your email *' })}
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
                  placeholder={t({ id: 'Perusahaan / instansi (opsional)', en: 'Company / organization (optional)' })}
                  value={form.company}
                  onChange={set('company')}
                  maxLength={150}
                />
                {err('company')}
              </div>
              <div>
                <select className={inputCls} value={form.purpose} onChange={set('purpose')}>
                  {PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[var(--bg-soft)]">
                      {t(o.label)}
                    </option>
                  ))}
                </select>
                {err('purpose')}
              </div>
              <div>
                <textarea
                  className={inputCls}
                  rows={3}
                  maxLength={1000}
                  placeholder={t({ id: 'Pesan singkat (opsional)', en: 'Short message (optional)' })}
                  value={form.message}
                  onChange={set('message')}
                />
                {err('message')}
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
                  {t({
                    id: 'Gagal mengirim. Coba lagi sebentar lagi.',
                    en: 'Failed to send. Please try again shortly.',
                  })}
                </p>
              )}
              {status === 'rate_limited' && (
                <p className="text-xs text-amber-400">
                  {t({
                    id: 'Terlalu banyak percobaan. Tunggu beberapa menit ya.',
                    en: 'Too many attempts. Please wait a few minutes.',
                  })}
                </p>
              )}

              <motion.button
                whileTap={reduce ? undefined : { scale: 0.97 }}
                disabled={status === 'submitting'}
                className="w-full rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
              >
                {status === 'submitting'
                  ? t({ id: 'Mengirim…', en: 'Sending…' })
                  : t({ id: '🔓 Buka Kontak Saya', en: '🔓 Unlock My Contact' })}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
