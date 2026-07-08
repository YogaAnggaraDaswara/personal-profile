import type { Project } from './types'

// ===== EDIT ME: project nyata dari karier (sumber: CV yoga-daswara-cv.pdf) =====
export const projects: Project[] = [
  {
    slug: 'enterprise-architecture-modernization',
    title: 'Enterprise IT Architecture Modernization',
    category: 'banking',
    summary: {
      id: 'Modernisasi arsitektur IT dari monolith ke microservices untuk transformasi digital banking.',
      en: 'Modernizing IT architecture from monolith to microservices for digital banking transformation.',
    },
    problem: {
      id: 'Sistem legacy monolitik menghambat kecepatan rilis, skalabilitas, dan observability.',
      en: 'A legacy monolithic system was slowing release velocity, scalability, and observability.',
    },
    solution: {
      id: 'Menerapkan arsitektur microservices (.NET Core, Golang, Python) dengan CI/CD pipeline di GCP & AWS.',
      en: 'Implemented a microservices architecture (.NET Core, Golang, Python) with CI/CD pipelines on GCP & AWS.',
    },
    architecture: {
      id: 'API gateway (Ocelot) → microservices per domain bisnis → observability stack (Grafana/Prometheus).',
      en: 'API gateway (Ocelot) → microservices per business domain → observability stack (Grafana/Prometheus).',
    },
    tech: ['.NET Core', 'Golang', 'Python', 'GCP', 'AWS', 'Kubernetes'],
    impact: {
      id: 'Siklus deployment turun 70%, waktu resolusi insiden turun 30%, SLA terjaga di atas 95%.',
      en: 'Deployment cycles cut by 70%, incident resolution time down 30%, SLA maintained above 95%.',
    },
  },
  {
    slug: 'observability-monitoring-platform',
    title: 'Observability & Monitoring Platform',
    category: 'web',
    summary: {
      id: 'Platform observability real-time untuk seluruh layanan perbankan.',
      en: 'Real-time observability platform across banking services.',
    },
    problem: {
      id: 'Insiden produksi baru diketahui setelah eskalasi manual atau laporan pengguna, respons lambat.',
      en: 'Production incidents were only discovered after manual escalation or user reports, causing slow response.',
    },
    solution: {
      id: 'Menerapkan Grafana + Prometheus untuk monitoring real-time dan alerting proaktif lintas layanan.',
      en: 'Deployed Grafana + Prometheus for real-time monitoring and proactive alerting across services.',
    },
    architecture: {
      id: 'Metric exporter di tiap layanan → Prometheus → dashboard Grafana + alerting otomatis.',
      en: 'Metric exporters per service → Prometheus → Grafana dashboards + automated alerting.',
    },
    tech: ['Grafana', 'Prometheus', 'Kubernetes'],
    impact: {
      id: 'Waktu resolusi insiden turun 30%, deteksi masalah bergeser dari reaktif ke proaktif.',
      en: 'Incident resolution time down 30%, issue detection shifted from reactive to proactive.',
    },
  },
  {
    slug: 'loan-origination-collection-system',
    title: 'Loan Origination & Collection System',
    category: 'banking',
    summary: {
      id: 'Sistem loan origination & collection untuk Bank Mandiri Taspen.',
      en: 'Loan origination & collection system for Bank Mandiri Taspen.',
    },
    problem: {
      id: 'Proses pengajuan dan penagihan pinjaman dilakukan manual, lambat dan sulit dilacak.',
      en: 'Loan application and collection processes were manual, slow, and hard to track.',
    },
    solution: {
      id: 'Membangun sistem end-to-end dari pengajuan sampai penagihan, memimpin tim 5 developer.',
      en: 'Built an end-to-end system from application to collection, leading a team of 5 developers.',
    },
    architecture: {
      id: 'Backend .NET terintegrasi langsung dengan core banking system Bank Mandiri Taspen.',
      en: '.NET backend directly integrated with Bank Mandiri Taspen\'s core banking system.',
    },
    tech: ['.NET', 'ASP.NET', 'MSSQL'],
    impact: {
      id: 'Waktu proses pinjaman berkurang 30%.',
      en: 'Loan processing time reduced by 30%.',
    },
  },
  {
    slug: 'legacy-migration-ibm-bpm',
    title: 'Legacy Migration to IBM BPM',
    category: 'banking',
    summary: {
      id: 'Migrasi aplikasi perbankan legacy dari .NET ke IBM BPM untuk Bank Negara Indonesia.',
      en: 'Migrating a legacy banking application from .NET to IBM BPM for Bank Negara Indonesia.',
    },
    problem: {
      id: 'Aplikasi legacy sulit di-scale dan minim otomasi proses bisnis.',
      en: 'The legacy application was hard to scale and had minimal business process automation.',
    },
    solution: {
      id: 'Migrasi ke platform IBM BPM dengan orkestrasi proses bisnis otomatis.',
      en: 'Migrated to the IBM BPM platform with automated business process orchestration.',
    },
    architecture: {
      id: 'IBM BPM sebagai process engine, terintegrasi dengan sistem existing Bank Negara Indonesia.',
      en: 'IBM BPM as the process engine, integrated with Bank Negara Indonesia\'s existing systems.',
    },
    tech: ['IBM BPM', '.NET', 'Process Automation'],
    impact: {
      id: 'Otomasi proses bisnis meningkat signifikan, performa sistem membaik.',
      en: 'Business process automation improved significantly, system performance increased.',
    },
  },
  {
    slug: 'loan-origination-appraisal-system',
    title: 'Loan Origination & Appraisal System',
    category: 'web',
    summary: {
      id: 'Sistem loan origination & appraisal multi-klien perbankan (OCBC NISP, Indosurya, Bank Mandiri).',
      en: 'Multi-client loan origination & appraisal system (OCBC NISP, Indosurya, Bank Mandiri).',
    },
    problem: {
      id: 'Proses appraisal dan pengajuan kredit dilakukan manual lintas cabang untuk beberapa klien bank.',
      en: 'Credit appraisal and application were manual, cross-branch processes for multiple bank clients.',
    },
    solution: {
      id: 'Aplikasi web (.NET/ASP.NET) dan Android terintegrasi API untuk mendukung operasional multi-bank.',
      en: 'A web app (.NET/ASP.NET) and Android app integrated via API to support multi-bank operations.',
    },
    architecture: {
      id: 'ASP.NET web app + aplikasi Android, terintegrasi API ke sistem masing-masing bank klien.',
      en: 'ASP.NET web app + Android app, integrated via API to each client bank\'s system.',
    },
    tech: ['.NET', 'ASP.NET', 'Android'],
    impact: {
      id: 'Interoperabilitas antar sistem meningkat, proses appraisal lebih cepat.',
      en: 'Cross-system interoperability improved, appraisal process became faster.',
    },
  },
]
