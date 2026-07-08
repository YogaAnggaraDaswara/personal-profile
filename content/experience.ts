import type { ExperienceItem } from './types'

// ===== EDIT ME: riwayat kerja (sesuaikan dengan CV) =====
export const experiences: ExperienceItem[] = [
  {
    company: 'Bank Sahabat Sampoerna',
    role: { id: 'IT Engineer', en: 'IT Engineer' },
    period: '2021 — Sekarang / Present',
    points: [
      {
        id: 'Mengembangkan dan memelihara aplikasi internal pendukung operasional perbankan.',
        en: 'Develop and maintain internal applications supporting banking operations.',
      },
      {
        id: 'Membangun use case AI internal: asisten pengetahuan, otomasi dokumen, dan pelaporan.',
        en: 'Build internal AI use cases: knowledge assistant, document automation, and reporting.',
      },
      {
        id: 'Integrasi antar sistem melalui REST API dengan standar keamanan perbankan.',
        en: 'Integrate systems through REST APIs following banking security standards.',
      },
    ],
  },
  {
    company: 'Perusahaan Sebelumnya',
    role: { id: 'Software Developer', en: 'Software Developer' },
    period: '2019 — 2021',
    points: [
      {
        id: 'Pengembangan aplikasi web end-to-end dari kebutuhan bisnis sampai rilis.',
        en: 'End-to-end web application development from business requirements to release.',
      },
    ],
  },
]
