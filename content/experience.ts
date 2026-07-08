import type { ExperienceItem } from './types'

// ===== EDIT ME: riwayat kerja (sesuaikan dengan CV/LinkedIn) =====
export const experiences: ExperienceItem[] = [
  {
    company: 'Bank Sahabat Sampoerna',
    role: {
      id: 'Head of IT Architecture & Systems Engineering',
      en: 'Head of IT Architecture & Systems Engineering',
    },
    period: 'Mar 2023 — Sekarang / Present',
    points: [
      {
        id: 'Memimpin arsitektur IT & tim rekayasa sistem untuk mendukung transformasi digital bank.',
        en: 'Lead IT architecture & systems engineering teams supporting the bank\'s digital transformation.',
      },
      {
        id: 'Menetapkan standar arsitektur yang scalable, aman, dan sesuai kepatuhan perbankan.',
        en: 'Set scalable, secure architecture standards aligned with banking compliance.',
      },
      {
        id: 'Menyinkronkan strategi teknologi lintas departemen dengan tujuan bisnis organisasi.',
        en: 'Align technology strategy across departments with organizational business goals.',
      },
    ],
  },
  {
    company: 'Bank Sahabat Sampoerna',
    role: { id: 'Head of IT System Analyst', en: 'Head of IT System Analyst' },
    period: 'Okt 2020 — Mar 2023',
    points: [
      {
        id: 'Memimpin tim analisa sistem untuk optimasi proses bisnis berbasis IT.',
        en: 'Led the systems analysis team to optimize IT-driven business processes.',
      },
      {
        id: 'Merancang solusi yang meningkatkan efisiensi operasional dan kualitas layanan.',
        en: 'Designed solutions that improved operational efficiency and service quality.',
      },
      {
        id: 'Mengelola requirement dan implementasi sistem lintas unit kerja.',
        en: 'Managed requirements and system implementation across business units.',
      },
    ],
  },
  {
    company: 'Bank Sahabat Sampoerna',
    role: { id: 'IT System Analyst Officer', en: 'IT System Analyst Officer' },
    period: 'Sep 2018 — Okt 2020',
    points: [
      {
        id: 'Menganalisis kebutuhan bisnis dan menerjemahkannya menjadi solusi IT.',
        en: 'Analyzed business requirements and translated them into IT solutions.',
      },
      {
        id: 'Berkontribusi pada peningkatan proses bisnis dan sistem internal.',
        en: 'Contributed to improving internal business processes and systems.',
      },
      {
        id: 'Mendukung pengembangan dan implementasi sistem inti perbankan.',
        en: 'Supported development and implementation of core banking systems.',
      },
    ],
  },
]
