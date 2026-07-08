import type { Stat } from './types'
import type { Bi } from '@/lib/i18n-core'

// ===== EDIT ME: data diri =====
export const profile = {
  name: 'Yoga Daswara',
  typingRoles: ['Head of IT Architecture', 'System Architect', 'Banking Tech Leader'],
  tagline: {
    id: 'Memimpin arsitektur & rekayasa sistem IT perbankan, mendorong transformasi digital yang scalable, aman, dan strategis.',
    en: 'Leading IT architecture & systems engineering in banking, driving digital transformation that is scalable, secure, and strategic.',
  } satisfies Bi,
  about: {
    id: 'Profesional IT berpengalaman yang memimpin tim arsitektur dan rekayasa sistem di industri perbankan. Fokus pada skalabilitas, performa, dan kepatuhan, saya menggerakkan inisiatif transformasi digital yang menyelaraskan teknologi dengan pertumbuhan bisnis. Saat ini memimpin pengembangan IT di Bank Sahabat Sampoerna, mengawasi implementasi strategis teknologi baru di lingkungan perbankan yang kompleks — membangun tim yang solid, menjaga sinergi lintas departemen, dan menghadirkan solusi yang tangguh serta scalable untuk mendukung tujuan organisasi.',
    en: 'Experienced IT professional leading architecture and engineering teams in the banking industry. Focused on scalability, performance, and compliance, I drive digital transformation initiatives that align technology with business growth. I currently lead IT development at Bank Sahabat Sampoerna, overseeing strategic implementation of emerging technologies in complex banking environments — building strong teams, ensuring cross-department synergy, and delivering robust, scalable solutions that support organizational goals.',
  } satisfies Bi,
  // Hanya "Tahun Pengalaman" yang diisi manual. Statistik Project & AI Use Case
  // dihitung otomatis dari jumlah entri di content/projects.ts & content/aiUseCases.ts.
  stats: [
    { value: 7, suffix: '+', label: { id: 'Tahun Pengalaman', en: 'Years of Experience' } },
  ] satisfies Stat[],
  cvFile: '/cv/yoga-daswara-cv.pdf',
}

// ===== EDIT ME: ganti URL dengan akun asli =====
export const socials: { label: string; url: string; icon: 'linkedin' | 'github' | 'instagram' }[] = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/yoga-daswara', icon: 'linkedin' },
  { label: 'GitHub', url: 'https://github.com/yoga-daswara', icon: 'github' },
  { label: 'Instagram', url: 'https://instagram.com/yoga.daswara', icon: 'instagram' },
]
