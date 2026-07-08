import type { Bi } from '@/lib/i18n-core'

export type Moment = { src: string; caption: Bi }

// ===== EDIT ME: foto momen/aktivitas singkat =====
export const moments: Moment[] = [
  {
    src: '/photos/yoga-aws.jpeg',
    caption: { id: 'Kunjungan ke kantor AWS', en: 'Visiting the AWS office' },
  },
  {
    src: '/photos/yoga-google.jpeg',
    caption: { id: 'Kunjungan ke kantor Google', en: 'Visiting the Google office' },
  },
]
