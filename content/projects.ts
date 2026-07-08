import type { Project } from './types'

// ===== EDIT ME: ganti placeholder ini dengan project nyata (tanpa nama sistem internal) =====
export const projects: Project[] = [
  {
    slug: 'ai-knowledge-assistant',
    title: 'Internal AI Knowledge Assistant',
    category: 'ai',
    summary: {
      id: 'Chatbot internal berbasis RAG untuk menjawab pertanyaan kebijakan & prosedur.',
      en: 'Internal RAG-based chatbot answering policy & procedure questions.',
    },
    problem: {
      id: 'Karyawan menghabiskan waktu mencari jawaban di ratusan dokumen kebijakan.',
      en: 'Employees spent significant time searching hundreds of policy documents.',
    },
    solution: {
      id: 'Chatbot dengan retrieval-augmented generation di atas basis dokumen internal, lengkap dengan sitasi sumber.',
      en: 'A retrieval-augmented generation chatbot over the internal document base, with source citations.',
    },
    architecture: {
      id: 'Pipeline ingest dokumen → vector store → LLM API dengan guardrail; frontend chat internal.',
      en: 'Document ingest pipeline → vector store → LLM API with guardrails; internal chat frontend.',
    },
    tech: ['Python', 'LLM API', 'Vector DB', 'FastAPI'],
    impact: {
      id: 'Waktu pencarian informasi turun drastis; jawaban konsisten dengan sumber tervalidasi.',
      en: 'Information lookup time dropped sharply; answers stay consistent with validated sources.',
    },
  },
  {
    slug: 'document-ocr-pipeline',
    title: 'Document OCR & Extraction Pipeline',
    category: 'ai',
    summary: {
      id: 'Pipeline OCR untuk ekstraksi data dokumen nasabah secara otomatis.',
      en: 'OCR pipeline for automatic data extraction from customer documents.',
    },
    problem: {
      id: 'Input data dari dokumen fisik dilakukan manual, lambat dan rawan salah ketik.',
      en: 'Data entry from physical documents was manual, slow, and typo-prone.',
    },
    solution: {
      id: 'OCR + validasi terstruktur mengubah scan dokumen menjadi data siap proses dengan review manusia untuk kasus ambigu.',
      en: 'OCR + structured validation turns document scans into process-ready data, with human review for ambiguous cases.',
    },
    architecture: {
      id: 'Antrian pemrosesan → OCR engine → validasi aturan → API integrasi ke sistem tujuan.',
      en: 'Processing queue → OCR engine → rule validation → integration API to target systems.',
    },
    tech: ['Python', 'OCR', 'Cloud Storage', 'REST API'],
    impact: {
      id: 'Proses input berkali lipat lebih cepat dengan tingkat akurasi lebih tinggi.',
      en: 'Multiple times faster intake with higher accuracy.',
    },
  },
  {
    slug: 'transaction-notification-service',
    title: 'Transaction Notification Service',
    category: 'banking',
    summary: {
      id: 'Layanan notifikasi transaksi multi-kanal yang andal dan idempotent.',
      en: 'Reliable, idempotent multi-channel transaction notification service.',
    },
    problem: {
      id: 'Notifikasi transaksi harus terkirim tepat sekali meski sistem hulu retry.',
      en: 'Transaction notifications must be delivered exactly once even when upstream systems retry.',
    },
    solution: {
      id: 'Service dengan idempotency key, antrian, dan audit log untuk setiap event notifikasi.',
      en: 'A service with idempotency keys, queues, and an audit log for every notification event.',
    },
    architecture: {
      id: 'Event masuk → deduplikasi idempotency key → antrian → pengirim per kanal → audit log.',
      en: 'Incoming events → idempotency-key dedup → queue → per-channel sender → audit log.',
    },
    tech: ['Java', 'Message Queue', 'SQL', 'REST API'],
    impact: {
      id: 'Duplikasi notifikasi hilang; jejak audit lengkap untuk kebutuhan compliance.',
      en: 'Duplicate notifications eliminated; complete audit trail for compliance.',
    },
  },
  {
    slug: 'service-monitoring-dashboard',
    title: 'Service Monitoring Dashboard',
    category: 'web',
    summary: {
      id: 'Dashboard pemantauan kesehatan layanan dan integrasi antar sistem.',
      en: 'Dashboard monitoring service health and cross-system integrations.',
    },
    problem: {
      id: 'Gangguan integrasi baru diketahui setelah ada laporan pengguna.',
      en: 'Integration issues were only discovered after user reports.',
    },
    solution: {
      id: 'Dashboard real-time dengan health check berkala dan alert saat anomali.',
      en: 'Real-time dashboard with periodic health checks and alerts on anomalies.',
    },
    architecture: {
      id: 'Kolektor metrik → penyimpanan time-series → dashboard web + alerting.',
      en: 'Metric collectors → time-series storage → web dashboard + alerting.',
    },
    tech: ['Node.js', 'Grafana', 'Prometheus', 'Docker'],
    impact: {
      id: 'Deteksi gangguan bergeser dari reaktif ke proaktif.',
      en: 'Issue detection shifted from reactive to proactive.',
    },
  },
  {
    slug: 'ai-report-automation',
    title: 'AI Report Automation',
    category: 'ai',
    summary: {
      id: 'Otomasi penyusunan draf laporan berkala dengan bantuan LLM.',
      en: 'LLM-assisted automation of recurring report drafting.',
    },
    problem: {
      id: 'Penyusunan laporan berkala menyita jam kerja tim setiap periode.',
      en: 'Recurring report drafting consumed team hours every cycle.',
    },
    solution: {
      id: 'Pipeline yang mengambil data terstruktur lalu menghasilkan draf naratif untuk direview manusia.',
      en: 'A pipeline that pulls structured data and produces narrative drafts for human review.',
    },
    architecture: {
      id: 'Sumber data → agregasi → template + LLM → draf → review & approval manusia.',
      en: 'Data sources → aggregation → template + LLM → draft → human review & approval.',
    },
    tech: ['Python', 'LLM API', 'SQL', 'Scheduler'],
    impact: {
      id: 'Waktu penyusunan draf turun signifikan; kualitas konsisten antar periode.',
      en: 'Draft time dropped significantly; quality stays consistent across cycles.',
    },
  },
  {
    slug: 'internal-portal',
    title: 'Company Internal Portal',
    category: 'web',
    summary: {
      id: 'Portal internal satu pintu untuk informasi dan layanan karyawan.',
      en: 'Single internal portal for employee information and services.',
    },
    problem: {
      id: 'Informasi internal tersebar di banyak kanal dan sulit dicari.',
      en: 'Internal information was scattered across channels and hard to find.',
    },
    solution: {
      id: 'Portal web responsif dengan pencarian terpusat dan integrasi layanan internal.',
      en: 'Responsive web portal with centralized search and internal service integrations.',
    },
    architecture: {
      id: 'Frontend web → API gateway → layanan internal; SSO untuk autentikasi.',
      en: 'Web frontend → API gateway → internal services; SSO for authentication.',
    },
    tech: ['Next.js', 'Node.js', 'SSO', 'REST API'],
    impact: {
      id: 'Satu titik akses; adopsi layanan internal meningkat.',
      en: 'One access point; internal service adoption increased.',
    },
  },
]
