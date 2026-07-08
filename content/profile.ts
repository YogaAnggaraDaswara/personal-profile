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
    id: 'Pemimpin Arsitektur & Engineering IT dengan hampir 10 tahun pengalaman di industri perbankan dan teknologi finansial. Berpengalaman menggerakkan enterprise architecture dan kepemimpinan development untuk membangun platform digital yang scalable, aman, dan berperforma tinggi. Terbukti mampu memimpin tim engineering lintas fungsi, menyusun roadmap teknologi, dan menerapkan arsitektur modern di lingkungan cloud (GCP, AWS) maupun on-premise. Berhasil menghadirkan 30+ project dan lebih dari 100+ change request sambil menjaga SLA di atas 95%. Saat ini fokus mendorong AI-assisted development dan automation untuk meningkatkan system analysis, dokumentasi business requirement (BRD), automation testing, dan produktivitas software engineering.',
    en: 'IT Architecture & Engineering Leader with nearly 10 years of experience in banking and financial technology industries. Experienced in driving enterprise architecture and development leadership to build scalable, secure, and high-performance digital platforms. Proven ability to lead cross-functional engineering teams, define technology roadmaps, and implement modern architectures across cloud (GCP, AWS) and on-premise environments. Successfully delivered 30+ projects and more than 100+ change requests while maintaining service level agreements above 95%. Currently driving AI-assisted development and automation to enhance system analysis, business requirement documentation (BRD), automation testing, and software engineering productivity.',
  } satisfies Bi,
  // Hanya "Tahun Pengalaman" yang diisi manual. Statistik Project & AI Use Case
  // dihitung otomatis dari jumlah entri di content/projects.ts & content/aiUseCases.ts.
  stats: [
    { value: 10, suffix: '+', label: { id: 'Tahun Pengalaman', en: 'Years of Experience' } },
  ] satisfies Stat[],
  cvFile: '/cv/yoga-daswara-cv.pdf',
}

// ===== EDIT ME: ganti URL dengan akun asli =====
export const socials: { label: string; url: string; icon: 'linkedin' | 'github' | 'instagram' }[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yogadaswara/', icon: 'linkedin' },
  { label: 'GitHub', url: 'https://github.com/YogaAnggaraDaswara', icon: 'github' },
  { label: 'Instagram', url: 'https://www.instagram.com/yoga.daswara/', icon: 'instagram' },
]
