import type { ExperienceItem } from './types'

// ===== EDIT ME: riwayat kerja (sumber: CV yoga-daswara-cv.pdf) =====
export const experiences: ExperienceItem[] = [
  {
    company: 'Bank Sahabat Sampoerna',
    role: {
      id: 'Head of IT Architecture & Systems Engineering',
      en: 'Head of IT Architecture & Systems Engineering',
    },
    period: 'Mar 2023 - Sekarang / Present',
    points: [
      {
        id: 'Memimpin inisiatif arsitektur IT enterprise untuk mendukung transformasi digital banking.',
        en: 'Lead enterprise IT architecture initiatives to support digital banking transformation.',
      },
      {
        id: 'Menggerakkan strategi teknologi lintas fungsi & modernisasi arsitektur sistem perbankan.',
        en: 'Spearhead cross-functional technology strategy and architecture modernization across banking systems.',
      },
      {
        id: 'Menerapkan arsitektur microservices (.NET Core, Golang, Python) & CI/CD (GCP, AWS), memangkas siklus deployment 70%.',
        en: 'Implement microservices architecture (.NET Core, Golang, Python) and CI/CD pipelines (GCP, AWS), reducing deployment cycles by 70%.',
      },
      {
        id: 'Menerapkan observability (Grafana) untuk meningkatkan reliabilitas sistem & mempercepat resolusi insiden 30%.',
        en: 'Deploy observability solutions (Grafana) to improve system reliability and reduce incident resolution time by 30%.',
      },
      {
        id: 'Menjaga ketersediaan sistem enterprise dengan SLA di atas 95% di seluruh platform perbankan.',
        en: 'Ensure enterprise system availability and maintain SLA above 95% across banking platforms.',
      },
    ],
  },
  {
    company: 'Bank Sahabat Sampoerna',
    role: { id: 'Head of IT System Analyst', en: 'Head of IT System Analyst' },
    period: 'Okt 2020 - Mar 2023',
    points: [
      {
        id: 'Memimpin tim lintas fungsi (system analyst & developer) dalam menghadirkan sistem operasional & lending perbankan.',
        en: 'Led cross-functional teams of system analysts and developers in delivering banking operational and lending systems.',
      },
      {
        id: 'Mengelola analisis sistem end-to-end: pengumpulan requirement bisnis, desain solusi, dan dokumentasi teknis.',
        en: 'Oversaw end-to-end system analysis including business requirement gathering, solution design, and technical documentation.',
      },
      {
        id: 'Berkolaborasi dengan tim arsitektur & engineering untuk menerjemahkan kebutuhan bisnis jadi solusi teknologi yang scalable.',
        en: 'Collaborated with architecture and engineering teams to translate business needs into scalable technology solutions.',
      },
      {
        id: 'Menggerakkan inisiatif modernisasi sistem & berkontribusi pada perencanaan roadmap teknologi.',
        en: 'Drove system modernization initiatives and contributed to technology roadmap planning to improve scalability, security, and operational efficiency.',
      },
    ],
  },
  {
    company: 'Bank Sahabat Sampoerna',
    role: { id: 'IT System Analyst Officer', en: 'IT System Analyst Officer' },
    period: 'Sep 2018 - Okt 2020',
    points: [
      {
        id: 'Melakukan analisis sistem & pengumpulan requirement untuk sistem operasional perbankan dan aplikasi lending.',
        en: 'Conducted system analysis and requirement gathering for banking operational systems and lending applications.',
      },
      {
        id: 'Merancang spesifikasi fungsional & dokumentasi sistem untuk platform perbankan internal.',
        en: 'Designed functional specifications and system documentation for internal banking platforms.',
      },
      {
        id: 'Mendukung pengembangan sistem loan origination untuk meningkatkan efisiensi proses lending.',
        en: 'Supported development of loan origination and supporting operational systems to improve lending process efficiency.',
      },
      {
        id: 'Berkolaborasi dengan tim development memastikan solusi sesuai kebutuhan bisnis & standar regulasi perbankan.',
        en: 'Collaborated with development teams to ensure solutions met business requirements and banking regulatory standards.',
      },
    ],
  },
  {
    company: 'Bank Mandiri Taspen',
    role: { id: 'IT Staff (Professional Development Program)', en: 'IT Staff (Professional Development Program)' },
    period: 'Sep 2017 - Sep 2018',
    points: [
      {
        id: 'Mengembangkan aplikasi perbankan internal untuk mendukung proses operasional.',
        en: 'Developed internal banking applications to support operational processes.',
      },
      {
        id: 'Terlibat dalam system testing, deployment, dan post-implementation support untuk menjaga stabilitas sistem.',
        en: 'Participated in system testing, deployment, and post-implementation support to ensure system stability and reliability.',
      },
    ],
  },
  {
    company: 'PT Digital Mind System (Vendor Projects)',
    role: { id: 'Lead Software Engineer - Banking Projects', en: 'Lead Software Engineer - Banking Projects' },
    period: 'Apr 2016 - Sep 2017',
    points: [
      {
        id: 'Memimpin pengembangan sistem Loan Origination & Collection untuk Bank Mandiri Taspen bersama tim 5 developer, memangkas waktu proses pinjaman 30%.',
        en: 'Led development of Loan Origination & Collection Systems for Bank Mandiri Taspen with a team of 5 developers, reducing loan processing time by 30%.',
      },
      {
        id: 'Migrasi aplikasi perbankan legacy dari .NET ke IBM BPM untuk Bank Negara Indonesia, meningkatkan otomasi & performa sistem.',
        en: 'Migrated legacy banking applications from .NET to IBM BPM for Bank Negara Indonesia, improving automation and system performance.',
      },
    ],
  },
  {
    company: 'PT Digital Mind System (Vendor Projects)',
    role: { id: 'Software Engineer - Banking Projects', en: 'Software Engineer - Banking Projects' },
    period: 'Sep 2015 - Apr 2016',
    points: [
      {
        id: 'Mengembangkan sistem Loan Origination & Appraisal menggunakan .NET, ASP.NET, dan Android. (Klien: OCBC NISP, Indosurya, Bank Mandiri)',
        en: 'Developed Loan Origination & Appraisal Systems using .NET, ASP.NET, and Android technologies. (Client: OCBC NISP, Indosurya, Bank Mandiri)',
      },
      {
        id: 'Mengintegrasikan API untuk mendukung operasional perbankan & meningkatkan interoperabilitas sistem.',
        en: 'Integrated APIs to support banking operations and improve system interoperability.',
      },
    ],
  },
]
