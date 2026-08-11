import type { Bi } from '@/lib/i18n-core'

// ===== EDIT ME: Konfigurasi situs — satu file untuk semua yang tersebar =====

/** Logo / brand initials shown in navbar & intro splash */
export const brand = {
  initials: 'YAD',
  siteName: 'Yoga Daswara Portfolio',
} as const

/** Default language for the site (also used in <html lang>) */
export const defaultLang = 'id' as const

// ─── Navigation ────────────────────────────────────────────────────────────────

export const navLinks = [
  { id: 'about', label: { id: 'Tentang', en: 'About' } },
  { id: 'skills', label: { id: 'Skill', en: 'Skills' } },
  { id: 'experience', label: { id: 'Pengalaman', en: 'Experience' } },
  { id: 'projects', label: { id: 'Project', en: 'Projects' } },
  { id: 'ai', label: { id: 'AI', en: 'AI' } },
  { id: 'contact', label: { id: 'Kontak', en: 'Contact' } },
] as const satisfies readonly { id: string; label: Bi }[]

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export const seo = {
  titleDefault: 'Yoga Daswara | IT Architecture & Systems Engineering',
  titleTemplate: '%s | Yoga Daswara',
  description:
    'Portfolio Yoga Daswara: IT Architecture & Systems Engineering leader in banking, driving digital transformation with scalable and secure solutions.',
  keywords: [
    'Yoga Daswara',
    'IT Architecture',
    'Systems Engineering',
    'Digital Banking',
    'Microservices',
    'Cloud Architecture',
    'GCP',
    'AWS',
    'Portfolio',
  ],
  locale: 'id_ID',
  alternateLocale: 'en_US',
  twitterHandle: '@yogadaswara',
} as const

// ─── Section Headings ──────────────────────────────────────────────────────────

export const headings = {
  about: { id: 'Tentang Saya', en: 'About Me' } satisfies Bi,
  skills: { id: 'Skill & Teknologi', en: 'Skills & Technologies' } satisfies Bi,
  experience: { id: 'Pengalaman Kerja', en: 'Work Experience' } satisfies Bi,
  projects: { id: 'Project', en: 'Projects' } satisfies Bi,
  ai: { id: 'Use Case AI', en: 'AI Use Cases' } satisfies Bi,
  contact: { id: 'Hubungi Saya', en: 'Get In Touch' } satisfies Bi,
} as const

// ─── Project Categories ────────────────────────────────────────────────────────

export const projectCategories = {
  ai: {
    label: { id: 'AI', en: 'AI' },
    coverGradient: 'from-fuchsia-600/40 to-cyan-500/30',
  },
  banking: {
    label: { id: 'Banking', en: 'Banking' },
    coverGradient: 'from-violet-600/40 to-blue-500/30',
  },
  web: {
    label: { id: 'Web', en: 'Web' },
    coverGradient: 'from-cyan-500/40 to-emerald-500/30',
  },
} as const satisfies Record<string, { label: Bi; coverGradient: string }>

export type ProjectCategoryKey = keyof typeof projectCategories

// ─── Skill Levels ──────────────────────────────────────────────────────────────

export const skillLevels = {
  expert: {
    label: 'Expert',
    badgeClass: 'border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]',
    dotClass: 'bg-[var(--cyan)]',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'border-[var(--violet)] bg-[var(--violet)]/10 text-[#c4b5fd]',
    dotClass: 'bg-[var(--violet)]',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'border-white/20 bg-white/5 text-[var(--muted)]',
    dotClass: 'bg-white/30',
  },
} as const satisfies Record<string, { label: string; badgeClass: string; dotClass: string }>

export type SkillLevelKey = keyof typeof skillLevels

// ─── Footer ────────────────────────────────────────────────────────────────────

export const footer = {
  copyright: 'Yoga Daswara',
  tagline: { id: 'Dibangun dengan Ai', en: 'Built with Ai' } satisfies Bi,
} as const
