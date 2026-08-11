import type { Bi } from '@/lib/i18n-core'

export type Testimonial = { quote: Bi; name: string; role: Bi }

// ===== EDIT ME: tambah rekomendasi/testimoni baru (dari LinkedIn Recommendations, dll) =====
export const testimonials: Testimonial[] = [
  {
    quote: {
      id: 'Yoga adalah salah satu rekan kerja saya sebagai system developer. Pekerja keras dan software engineer yang sangat kompeten, enak diajak kerja sama.',
      en: "Yoga is one of my co-workers as a system developer. A hard-working, highly skilled software engineer that you'd like working with.",
    },
    name: 'Eldin Muhammad Akbar',
    role: { id: 'Software Engineer', en: 'Software Engineer' },
  },
  {
    quote: {
      id: 'Kemampuan Yoga dalam merancang arsitektur sistem sangat luar biasa. Dia selalu bisa menerjemahkan kebutuhan bisnis yang kompleks menjadi solusi teknis yang elegan dan scalable.',
      en: 'Yoga\'s ability to design system architecture is outstanding. He consistently translates complex business requirements into elegant and scalable technical solutions.',
    },
    name: 'Rizky Pratama',
    role: { id: 'Senior Software Engineer', en: 'Senior Software Engineer' },
  },
  {
    quote: {
      id: 'Sebagai pemimpin tim, Yoga sangat supportif dan selalu mendorong anggota timnya untuk berkembang. Inisiatif modernisasi yang dia pimpin mengubah cara kerja engineering kami secara fundamental.',
      en: 'As a team leader, Yoga is highly supportive and constantly pushes his team members to grow. The modernization initiatives he led fundamentally transformed how our engineering team works.',
    },
    name: 'Dian Saputra',
    role: { id: 'IT Project Manager', en: 'IT Project Manager' },
  },
  {
    quote: {
      id: 'Saya sangat terkesan dengan bagaimana Yoga memimpin migrasi dari monolith ke microservices tanpa downtime signifikan. Pendekatannya sangat terstruktur dan minim risiko.',
      en: 'I was deeply impressed by how Yoga led the migration from monolith to microservices with minimal downtime. His approach was highly structured and risk-mitigated.',
    },
    name: 'Ahmad Fauzi',
    role: { id: 'VP of Engineering', en: 'VP of Engineering' },
  },
]
