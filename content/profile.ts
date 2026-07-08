import type { Stat } from './types'
import type { Bi } from '@/lib/i18n-core'

// ===== EDIT ME: data diri =====
export const profile = {
  name: 'Yoga Daswara',
  typingRoles: ['IT Engineer', 'AI Builder', 'Banking Tech Enthusiast'],
  tagline: {
    id: 'Membangun solusi teknologi & use case AI di industri perbankan.',
    en: 'Building technology solutions & AI use cases in the banking industry.',
  } satisfies Bi,
  about: {
    id: 'Engineer IT di industri perbankan Indonesia. Fokus pada pengembangan aplikasi, integrasi sistem, dan implementasi use case AI untuk mendukung proses bisnis — dari otomasi dokumen sampai asisten internal berbasis LLM.',
    en: 'IT engineer in the Indonesian banking industry. Focused on application development, system integration, and implementing AI use cases that support business processes — from document automation to LLM-based internal assistants.',
  } satisfies Bi,
  stats: [
    { value: 5, suffix: '+', label: { id: 'Tahun Pengalaman', en: 'Years of Experience' } },
    { value: 6, suffix: '+', label: { id: 'Project Dikembangkan', en: 'Projects Delivered' } },
    { value: 3, suffix: '+', label: { id: 'Use Case AI', en: 'AI Use Cases' } },
  ] satisfies Stat[],
}
