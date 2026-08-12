import type { OrgUnit } from './types'
import type { Bi } from '@/lib/i18n-core'

/**
 * PRIVASI: sengaja tanpa nama anggota dan tanpa jumlah posisi kosong.
 * Situs ini publik - nama karyawan adalah data internal, dan posisi kosong
 * membocorkan kondisi headcount ke luar. Cukup jumlah orang per bagian.
 */

// ===== EDIT ME: departemen yang kamu pimpin =====
export const department = {
  name: {
    id: 'IT Architecture & Engineering',
    en: 'IT Architecture & Engineering',
  } satisfies Bi,
  role: {
    id: 'Department Head',
    en: 'Department Head',
  } satisfies Bi,
  summary: {
    id: 'Satu departemen, tiga disiplin yang saling mengunci: infrastruktur yang menopang, arsitektur yang merancang, dan quality assurance yang membuktikan. Setiap perubahan sistem perbankan lewat ketiganya sebelum masuk produksi.',
    en: 'One department, three interlocking disciplines: infrastructure that carries the load, architecture that designs the shape, and quality assurance that proves it works. Every banking system change passes through all three before it reaches production.',
  } satisfies Bi,
}

// ===== EDIT ME: bagian di bawah departemen =====
// Ganti angka headcount sesuai kondisi terkini. Isi 0 kalau tidak mau
// menampilkan jumlah orang untuk bagian itu.
export const orgUnits: OrgUnit[] = [
  {
    key: 'system-engineer',
    name: { id: 'IT System Engineer', en: 'IT System Engineer' },
    accent: 'cyan',
    headcount: 3,
    focus: {
      id: 'Menjaga infrastruktur, jaringan, dan platform tetap hidup dan terukur.',
      en: 'Keeps infrastructure, networks, and platforms alive and measurable.',
    },
    scope: [
      { id: 'Operasional server, jaringan, dan platform cloud', en: 'Server, network, and cloud platform operations' },
      { id: 'Observability, monitoring, dan kapasitas', en: 'Observability, monitoring, and capacity' },
      { id: 'Hardening, patching, dan kesiapan disaster recovery', en: 'Hardening, patching, and disaster recovery readiness' },
    ],
  },
  {
    key: 'solution-architecture',
    name: { id: 'IT Solution Architecture', en: 'IT Solution Architecture' },
    accent: 'violet',
    // Angka 0 = jumlah orang tidak ditampilkan. Ganti kalau posisi sudah terisi.
    headcount: 0,
    focus: {
      id: 'Menerjemahkan kebutuhan bisnis jadi rancangan sistem yang bisa dibangun.',
      en: 'Turns business needs into system designs that can actually be built.',
    },
    scope: [
      { id: 'Enterprise architecture dan technology roadmap', en: 'Enterprise architecture and technology roadmap' },
      { id: 'Desain integrasi, API, dan kontrak antar sistem', en: 'Integration, API, and inter-system contract design' },
      { id: 'Architecture review sebelum development dimulai', en: 'Architecture review before development starts' },
    ],
  },
  {
    key: 'quality-assurance',
    name: { id: 'IT Quality Assurance', en: 'IT Quality Assurance' },
    accent: 'emerald',
    headcount: 6,
    focus: {
      id: 'Membuktikan setiap rilis layak masuk produksi, bukan sekadar berharap.',
      en: 'Proves every release is fit for production instead of hoping it is.',
    },
    scope: [
      { id: 'Functional, regression, dan user acceptance testing', en: 'Functional, regression, and user acceptance testing' },
      { id: 'Automation testing dan manajemen test data', en: 'Automation testing and test data management' },
      { id: 'Quality gate dan sign-off sebelum go-live', en: 'Quality gate and sign-off before go-live' },
    ],
  },
]
