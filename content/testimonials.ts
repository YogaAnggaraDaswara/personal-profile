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
]
