# Personal Profile Web (Yoga Daswara) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-page animated dark-neon portfolio for Yoga Daswara with a form-gated contact reveal, bilingual ID/EN content from editable data files, deployed on Vercel.

**Architecture:** Next.js App Router, static client components + one server API route (`POST /api/contact`) that validates, rate-limits, sends a best-effort Resend notification, and returns contact details stored only in server env vars. All display strings are `{ id, en }` objects resolved by a React language context.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Framer Motion, Vitest. No database. Resend via plain `fetch` (no SDK).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-08-personal-profile-design.md`
- Contact email/WA NEVER appear in client code or content files — only `process.env` on the server.
- Env vars: `CONTACT_EMAIL`, `CONTACT_WA`, `RESEND_API_KEY`, `NOTIF_TO_EMAIL`. `.env.example` uses explicit placeholders (`<GANTI_...>`), never real values.
- Every display string is `Bi = { id: string; en: string }`.
- All motion respects `prefers-reduced-motion` (Framer Motion `useReducedMotion` / static fallback).
- Animations use transform/opacity only (60fps target).
- Placeholder content: generic descriptions only — no real internal system names, hosts, or topology.
- No stack traces to clients; API returns structured JSON errors.
- Commit after every task. Working dir `D:\Pribadi\Profile` is the repo root (git already initialized).

---

### Task 1: Scaffold project, theme, test runner

**Files:**
- Create: Next.js scaffold in repo root (`app/`, `package.json`, etc. via create-next-app)
- Modify: `app/globals.css`
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: running Next app; CSS utility classes `.glass`, `.grad-text`, `.section-shell` used by all UI tasks; `npm test` runs Vitest.

- [ ] **Step 1: Scaffold Next.js into the repo root**

```bash
npx --yes create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: scaffold completes (existing `docs/` and `.superpowers/` untouched; if create-next-app refuses non-empty dir, temporarily move `docs` out, scaffold, move back).

- [ ] **Step 2: Add runtime + dev dependencies**

```bash
npm install framer-motion
npm install -D vitest
```

- [ ] **Step 3: Add `.superpowers/` to `.gitignore`**

Append line `.superpowers/` to `.gitignore`.

- [ ] **Step 4: Replace `app/globals.css` with the dark-neon theme**

```css
@import "tailwindcss";

:root {
  --bg: #05050d;
  --bg-soft: #0a0a14;
  --violet: #7c3aed;
  --cyan: #22d3ee;
  --text: #e2e8f0;
  --muted: #94a3b8;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}

.glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
}

.grad-text {
  background: linear-gradient(90deg, var(--violet), var(--cyan));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-shell {
  max-width: 72rem;
  margin: 0 auto;
  padding: 6rem 1.25rem 0;
  scroll-margin-top: 5rem;
}

.glow-ring {
  background: conic-gradient(from 180deg, var(--violet), var(--cyan), var(--violet));
  padding: 4px;
  border-radius: 9999px;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  test: {
    include: ['lib/__tests__/**/*.test.ts', 'app/api/**/__tests__/**/*.test.ts'],
    environment: 'node',
  },
})
```

- [ ] **Step 6: Add test script to `package.json`**

In `"scripts"`, add: `"test": "vitest run"`.

- [ ] **Step 7: Verify dev server and build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with dark-neon theme and vitest"
```

---

### Task 2: i18n core + language provider

**Files:**
- Create: `lib/i18n-core.ts`
- Create: `lib/i18n.tsx`
- Test: `lib/__tests__/i18n-core.test.ts`

**Interfaces:**
- Produces: `type Lang = 'id' | 'en'`, `type Bi = { id: string; en: string }`, `pick(b: Bi, lang: Lang): string` (from `@/lib/i18n-core`); `LanguageProvider`, `useLang(): { lang: Lang; setLang(l: Lang): void; t(b: Bi): string }` (from `@/lib/i18n`). Every later UI task consumes `useLang`.

- [ ] **Step 1: Write the failing test — `lib/__tests__/i18n-core.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { pick, type Bi } from '@/lib/i18n-core'

const b: Bi = { id: 'Halo', en: 'Hello' }

describe('pick', () => {
  it('returns Indonesian text for lang id', () => {
    expect(pick(b, 'id')).toBe('Halo')
  })
  it('returns English text for lang en', () => {
    expect(pick(b, 'en')).toBe('Hello')
  })
  it('falls back to id when en is empty', () => {
    expect(pick({ id: 'Isi', en: '' }, 'en')).toBe('Isi')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/i18n-core`.

- [ ] **Step 3: Implement `lib/i18n-core.ts`**

```ts
export type Lang = 'id' | 'en'
export type Bi = { id: string; en: string }

export function pick(b: Bi, lang: Lang): string {
  return b[lang] || b.id
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement `lib/i18n.tsx` (provider — verified via build; DOM tests out of scope)**

```tsx
'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { pick, type Bi, type Lang } from './i18n-core'

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void; t: (b: Bi) => string }

const LangContext = createContext<LangContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (b) => b.id,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id')

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'id' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: (b) => pick(b, lang) }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
```

- [ ] **Step 6: Commit**

```bash
git add lib
git commit -m "feat: add bilingual i18n core and language provider"
```

---

### Task 3: Content data files

**Files:**
- Create: `content/types.ts`
- Create: `content/profile.ts`
- Create: `content/skills.ts`
- Create: `content/experience.ts`
- Create: `content/projects.ts`
- Create: `content/aiUseCases.ts`

**Interfaces:**
- Consumes: `Bi` from `@/lib/i18n-core`.
- Produces: typed exports `profile`, `skillGroups`, `marqueeTech`, `experiences`, `projects`, `aiUseCases` consumed by UI tasks 6-9. Exact types below.

All entries here are USER-EDITABLE content. Experience entries derive from the CV; project/AI entries are clearly generic placeholders the user will replace. No real internal system identifiers.

- [ ] **Step 1: Create `content/types.ts`**

```ts
import type { Bi } from '@/lib/i18n-core'

export type Stat = { value: number; suffix?: string; label: Bi }

export type SkillGroup = { title: Bi; items: string[] }

export type ExperienceItem = {
  company: string
  role: Bi
  period: string
  points: Bi[]
}

export type ProjectCategory = 'ai' | 'banking' | 'web'

export type Project = {
  slug: string
  title: string
  category: ProjectCategory
  summary: Bi
  problem: Bi
  solution: Bi
  architecture: Bi
  tech: string[]
  impact: Bi
}

export type AiUseCase = { title: Bi; description: Bi; tech: string[] }
```

- [ ] **Step 2: Create `content/profile.ts`**

```ts
import type { Stat } from './types'
import type { Bi } from '@/lib/i18n-core'

// ===== EDIT ME: data diri =====
export const profile = {
  name: 'Yoga Daswara',
  typingRoles: ['IT Engineer', 'AI Builder', 'Banking Tech Enthusiast'],
  tagline: {
    id: 'Membangun solusi teknologi & use case AI di industri perbankan.',
    en: 'Building technology solutions & AI use cases in the banking industry.',
  } satisfies Bi,
  about: {
    id: 'Engineer IT di industri perbankan Indonesia. Fokus pada pengembangan aplikasi, integrasi sistem, dan implementasi use case AI untuk mendukung proses bisnis — dari otomasi dokumen sampai asisten internal berbasis LLM.',
    en: 'IT engineer in the Indonesian banking industry. Focused on application development, system integration, and implementing AI use cases that support business processes — from document automation to LLM-based internal assistants.',
  } satisfies Bi,
  stats: [
    { value: 5, suffix: '+', label: { id: 'Tahun Pengalaman', en: 'Years of Experience' } },
    { value: 6, suffix: '+', label: { id: 'Project Dikembangkan', en: 'Projects Delivered' } },
    { value: 3, suffix: '+', label: { id: 'Use Case AI', en: 'AI Use Cases' } },
  ] satisfies Stat[],
}
```

- [ ] **Step 3: Create `content/skills.ts`**

```ts
import type { SkillGroup } from './types'

// ===== EDIT ME: kelompok skill =====
export const skillGroups: SkillGroup[] = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: ['Java', 'Python', 'Node.js', 'Next.js', 'Spring Boot'],
  },
  {
    title: { id: 'AI & Data', en: 'AI & Data' },
    items: ['LLM Integration', 'RAG', 'OCR', 'Prompt Engineering', 'SQL'],
  },
  {
    title: { id: 'Platform & Tools', en: 'Platforms & Tools' },
    items: ['GCP', 'Docker', 'Git', 'REST API', 'CI/CD'],
  },
]

export const marqueeTech = [
  'Java', 'Python', 'Node.js', 'Next.js', 'GCP', 'Docker',
  'LLM', 'RAG', 'OCR', 'SQL', 'REST API', 'Spring Boot',
]
```

- [ ] **Step 4: Create `content/experience.ts`**

```ts
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
```

- [ ] **Step 5: Create `content/projects.ts`**

```ts
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
```

- [ ] **Step 6: Create `content/aiUseCases.ts`**

```ts
import type { AiUseCase } from './types'

// ===== EDIT ME: use case AI yang sedang diimplementasikan =====
export const aiUseCases: AiUseCase[] = [
  {
    title: { id: 'Asisten Pengetahuan Internal', en: 'Internal Knowledge Assistant' },
    description: {
      id: 'LLM + RAG menjawab pertanyaan prosedur & kebijakan dengan sitasi sumber, mengurangi ketergantungan pada pencarian manual.',
      en: 'LLM + RAG answers procedure & policy questions with source citations, reducing reliance on manual search.',
    },
    tech: ['RAG', 'LLM API', 'Vector DB'],
  },
  {
    title: { id: 'Otomasi Dokumen', en: 'Document Automation' },
    description: {
      id: 'OCR + ekstraksi terstruktur mengubah dokumen fisik menjadi data siap proses dengan validasi berlapis.',
      en: 'OCR + structured extraction turns physical documents into process-ready data with layered validation.',
    },
    tech: ['OCR', 'Python', 'Rule Engine'],
  },
  {
    title: { id: 'Draf Laporan Otomatis', en: 'Automated Report Drafting' },
    description: {
      id: 'Data terstruktur diubah menjadi draf naratif oleh LLM, selalu dengan review dan approval manusia.',
      en: 'Structured data becomes narrative drafts via LLM, always with human review and approval.',
    },
    tech: ['LLM API', 'SQL', 'Scheduler'],
  },
]
```

- [ ] **Step 7: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add content
git commit -m "feat: add editable bilingual content data files"
```

---

### Task 4: Contact validation + API route

**Files:**
- Create: `lib/contact-validation.ts`
- Create: `app/api/contact/route.ts`
- Test: `lib/__tests__/contact-validation.test.ts`
- Test: `app/api/contact/__tests__/route.test.ts`

**Interfaces:**
- Produces:
  - `validateContact(raw: unknown): { ok: true; value: ContactPayload } | { ok: false; errors: Record<string, string> }`
  - `ContactPayload = { name: string; email: string; company: string; purpose: 'recruitment' | 'collaboration' | 'consultation' | 'other'; message: string; website: string }` (`website` = honeypot)
  - `POST /api/contact` responses: `422 { ok:false, errors }`, `429 { ok:false, errors:{form:'rate_limited'} }`, `200 { ok:true }` (honeypot), `200 { ok:true, contact:{ email, whatsapp } }` (success; `whatsapp` digits-only).
- Task 9 (ContactGate UI) consumes these response shapes exactly.

- [ ] **Step 1: Write failing validation tests — `lib/__tests__/contact-validation.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { validateContact } from '@/lib/contact-validation'

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  company: 'PT Contoh',
  purpose: 'recruitment',
  message: 'Halo, tertarik diskusi.',
  website: '',
}

describe('validateContact', () => {
  it('accepts a valid payload', () => {
    const r = validateContact(valid)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.name).toBe('Budi Santoso')
  })

  it('trims whitespace', () => {
    const r = validateContact({ ...valid, name: '  Budi  ' })
    if (r.ok) expect(r.value.name).toBe('Budi')
    expect(r.ok).toBe(true)
  })

  it('rejects short name', () => {
    const r = validateContact({ ...valid, name: 'B' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.name).toBeDefined()
  })

  it('rejects bad email', () => {
    const r = validateContact({ ...valid, email: 'not-an-email' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.email).toBeDefined()
  })

  it('rejects unknown purpose', () => {
    const r = validateContact({ ...valid, purpose: 'spam' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.purpose).toBeDefined()
  })

  it('rejects non-object input', () => {
    const r = validateContact('junk')
    expect(r.ok).toBe(false)
  })

  it('keeps honeypot field', () => {
    const r = validateContact({ ...valid, website: 'http://bot.example' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.website).toBe('http://bot.example')
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/contact-validation`.

- [ ] **Step 3: Implement `lib/contact-validation.ts`**

```ts
export const PURPOSES = ['recruitment', 'collaboration', 'consultation', 'other'] as const
export type Purpose = (typeof PURPOSES)[number]

export type ContactPayload = {
  name: string
  email: string
  company: string
  purpose: Purpose
  message: string
  website: string
}

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(raw: unknown): ValidationResult {
  const d = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const name = str(d.name)
  const email = str(d.email)
  const company = str(d.company)
  const purpose = str(d.purpose)
  const message = str(d.message)
  const website = str(d.website)

  const errors: Record<string, string> = {}
  if (name.length < 2 || name.length > 100) errors.name = 'invalid'
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'invalid'
  if (company.length > 150) errors.company = 'invalid'
  if (!(PURPOSES as readonly string[]).includes(purpose)) errors.purpose = 'invalid'
  if (message.length > 1000) errors.message = 'invalid'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, email, company, purpose: purpose as Purpose, message, website } }
}
```

- [ ] **Step 4: Run validation tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write failing route tests — `app/api/contact/__tests__/route.test.ts`**

Each test uses a unique `x-forwarded-for` so the in-memory rate limiter never cross-contaminates.

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '@/app/api/contact/route'

function req(body: unknown, ip: string) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  company: '',
  purpose: 'collaboration',
  message: '',
  website: '',
}

beforeEach(() => {
  process.env.CONTACT_EMAIL = 'dummy-contact@example.com'
  process.env.CONTACT_WA = '+62 812-0000-0000'
  delete process.env.RESEND_API_KEY
})

describe('POST /api/contact', () => {
  it('returns contact on valid submit', async () => {
    const res = await POST(req(valid, '10.0.0.1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.contact.email).toBe('dummy-contact@example.com')
    expect(json.contact.whatsapp).toBe('6281200000000')
  })

  it('returns 422 with field errors on invalid payload', async () => {
    const res = await POST(req({ ...valid, email: 'nope' }, '10.0.0.2'))
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.ok).toBe(false)
    expect(json.errors.email).toBeDefined()
  })

  it('returns generic success without contact when honeypot filled', async () => {
    const res = await POST(req({ ...valid, website: 'http://bot.example' }, '10.0.0.3'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.contact).toBeUndefined()
  })

  it('returns 429 after limit exceeded', async () => {
    let last: Response | null = null
    for (let i = 0; i < 6; i++) last = await POST(req(valid, '10.0.0.4'))
    expect(last!.status).toBe(429)
  })

  it('returns 400 on non-JSON body', async () => {
    const res = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'x-forwarded-for': '10.0.0.5' },
        body: 'not json',
      }),
    )
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 6: Run route tests to verify failure**

Run: `npm test`
Expected: FAIL — cannot resolve `@/app/api/contact/route`.

- [ ] **Step 7: Implement `app/api/contact/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { validateContact, type ContactPayload } from '@/lib/contact-validation'

const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, { count: number; ts: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || now - h.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
    return false
  }
  h.count += 1
  return h.count > LIMIT
}

async function notify(value: ContactPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIF_TO_EMAIL
  if (!key || !to) {
    console.log('[contact] notification skipped (RESEND_API_KEY/NOTIF_TO_EMAIL not set)')
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Profile Site <onboarding@resend.dev>',
        to: [to],
        subject: `[Profile] ${value.purpose} — ${value.name}`,
        text: [
          `Nama    : ${value.name}`,
          `Email   : ${value.email}`,
          `Company : ${value.company || '-'}`,
          `Purpose : ${value.purpose}`,
          `Message : ${value.message || '-'}`,
        ].join('\n'),
      }),
    })
    if (!res.ok) console.error('[contact] notification failed', res.status)
  } catch (err) {
    console.error('[contact] notification failed', err)
  }
}

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'bad_request' } }, { status: 400 })
  }

  const result = validateContact(raw)
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: { form: 'rate_limited' } }, { status: 429 })
  }

  // Honeypot: bots get a generic success with no contact data and no notification.
  if (result.value.website) {
    return NextResponse.json({ ok: true })
  }

  await notify(result.value)

  return NextResponse.json({
    ok: true,
    contact: {
      email: process.env.CONTACT_EMAIL ?? '',
      whatsapp: (process.env.CONTACT_WA ?? '').replace(/\D/g, ''),
    },
  })
}
```

- [ ] **Step 8: Run all tests**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 9: Commit**

```bash
git add lib app/api
git commit -m "feat: add gated contact API with validation, honeypot, rate limit, Resend notify"
```

---

### Task 5: App shell — layout, navbar, footer, reveal helper

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`
- Create: `components/Reveal.tsx`

**Interfaces:**
- Consumes: `LanguageProvider`, `useLang` (Task 2).
- Produces: `<Reveal delay={n} className="...">{children}</Reveal>` scroll-reveal wrapper used by Tasks 6-9; page skeleton with section ids `about`, `skills`, `experience`, `projects`, `ai`, `contact`.

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yoga Daswara — IT Engineer & AI Builder',
  description:
    'Portfolio Yoga Daswara: IT engineer di industri perbankan, membangun aplikasi dan use case AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `components/Reveal.tsx`**

```tsx
'use client'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Create `components/Navbar.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n'

const LINKS = [
  { href: '#about', label: { id: 'Tentang', en: 'About' } },
  { href: '#skills', label: { id: 'Skill', en: 'Skills' } },
  { href: '#experience', label: { id: 'Pengalaman', en: 'Experience' } },
  { href: '#projects', label: { id: 'Project', en: 'Projects' } },
  { href: '#ai', label: { id: 'AI', en: 'AI' } },
  { href: '#contact', label: { id: 'Kontak', en: 'Contact' } },
]

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass mx-auto mt-3 flex max-w-5xl items-center justify-between px-4 py-2.5 md:px-6">
        <a href="#top" className="grad-text text-lg font-extrabold tracking-tight">
          YD<span className="text-[var(--cyan)]">.</span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              {t(l.label)}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
            aria-label="Toggle language"
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-[var(--cyan)]"
            aria-label="Toggle language"
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl leading-none text-white"
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-3 mt-2 flex flex-col gap-1 p-3 md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-white"
              >
                {t(l.label)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 4: Create `components/Footer.tsx`**

```tsx
'use client'
import { useLang } from '@/lib/i18n'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-24 border-t border-white/10 py-8 text-center text-xs text-[var(--muted)]">
      <p>
        © {new Date().getFullYear()} Yoga Daswara ·{' '}
        {t({ id: 'Dibangun dengan Next.js', en: 'Built with Next.js' })}
      </p>
    </footer>
  )
}
```

- [ ] **Step 5: Replace `app/page.tsx` with the section skeleton**

Sections fill in over Tasks 6-9; until then they are stubs that render headings only. Final shape:

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main id="top">
      <Navbar />
      <section id="hero" className="section-shell">{/* Task 6 */}</section>
      <section id="about" className="section-shell">{/* Task 6 */}</section>
      <section id="skills" className="section-shell">{/* Task 7 */}</section>
      <section id="experience" className="section-shell">{/* Task 7 */}</section>
      <section id="projects" className="section-shell">{/* Task 8 */}</section>
      <section id="ai" className="section-shell">{/* Task 8 */}</section>
      <section id="contact" className="section-shell">{/* Task 9 */}</section>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app components
git commit -m "feat: add app shell with navbar, footer, reveal helper, section skeleton"
```

---

### Task 6: Hero (particles, typing, photo) + About (counters)

**Files:**
- Create: `components/Particles.tsx`
- Create: `components/Hero.tsx`
- Create: `components/Counter.tsx`
- Create: `components/About.tsx`
- Create: `public/profile-placeholder.svg`
- Modify: `app/page.tsx` (mount Hero + About)

**Interfaces:**
- Consumes: `profile` (Task 3), `useLang` (Task 2), `Reveal` (Task 5).
- Produces: photo path convention `/profile.jpg` with automatic fallback to `/profile-placeholder.svg`.

- [ ] **Step 1: Create `public/profile-placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c3aed"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="320" height="320" fill="#0a0a14"/>
  <circle cx="160" cy="120" r="56" fill="url(#g)" opacity="0.85"/>
  <path d="M60 300c14-64 54-96 100-96s86 32 100 96z" fill="url(#g)" opacity="0.85"/>
  <text x="160" y="308" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">profile.jpg</text>
</svg>
```

- [ ] **Step 2: Create `components/Particles.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Dot = { x: number; y: number; vx: number; vy: number; r: number; c: string }

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let dots: Dot[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const n = Math.min(70, Math.floor(canvas.width / 18))
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
        c: Math.random() > 0.5 ? '124,58,237' : '34,211,238',
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.c},0.7)`
        ctx.fill()
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < 110) {
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 110)})`
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  if (reduce) return null
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}
```

- [ ] **Step 3: Create `components/Hero.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Particles from './Particles'

function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState(enabled ? '' : words[0])
  useEffect(() => {
    if (!enabled) return
    let w = 0
    let i = 0
    let del = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const word = words[w]
      i = del ? i - 1 : i + 1
      setText(word.slice(0, i))
      let delay = del ? 40 : 90
      if (!del && i === word.length) {
        del = true
        delay = 1600
      } else if (del && i === 0) {
        del = false
        w = (w + 1) % words.length
        delay = 300
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [words, enabled])
  return text
}

export default function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const typed = useTypewriter(profile.typingRoles, !reduce)
  const [src, setSrc] = useState('/profile.jpg')

  return (
    <div className="relative flex min-h-[92vh] items-center overflow-hidden">
      <Particles />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--violet)]/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-[var(--cyan)]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-5 md:flex-row md:justify-between">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl text-center md:text-left"
        >
          <p className="text-sm tracking-[0.3em] text-[var(--cyan)] uppercase">
            {t({ id: 'Halo, saya', en: 'Hi, I am' })}
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight md:text-7xl">
            <span className="grad-text">{profile.name}</span>
          </h1>
          <p className="mt-4 h-8 text-xl font-semibold text-white md:text-2xl">
            {typed}
            <span className="animate-pulse text-[var(--cyan)]">|</span>
          </p>
          <p className="mt-4 text-[var(--muted)]">{t(profile.tagline)}</p>
          <div className="mt-8 flex justify-center gap-4 md:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              {t({ id: 'Lihat Project', en: 'View Projects' })}
            </a>
            <a
              href="#contact"
              className="glass px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              {t({ id: 'Hubungi Saya', en: 'Contact Me' })}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          whileHover={reduce ? undefined : { rotate: 2, scale: 1.03 }}
          className="glow-ring shadow-[0_0_60px_rgba(124,58,237,0.45)]"
        >
          <img
            src={src}
            onError={() => setSrc('/profile-placeholder.svg')}
            alt="Foto Yoga Daswara"
            className="h-48 w-48 rounded-full bg-[var(--bg-soft)] object-cover md:h-64 md:w-64"
          />
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/Counter.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export default function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className="grad-text text-4xl font-extrabold md:text-5xl">
      {n}
      {suffix}
    </span>
  )
}
```

- [ ] **Step 5: Create `components/About.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { profile } from '@/content/profile'
import Reveal from './Reveal'
import Counter from './Counter'

export default function About() {
  const { t } = useLang()
  const [src, setSrc] = useState('/profile.jpg')

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Tentang Saya', en: 'About Me' })} <span className="grad-text">.</span>
        </h2>
      </Reveal>
      <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
        <Reveal delay={0.1} className="shrink-0">
          <img
            src={src}
            onError={() => setSrc('/profile-placeholder.svg')}
            alt=""
            className="glass h-28 w-28 rounded-2xl object-cover"
          />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-2xl leading-relaxed text-[var(--muted)]">{t(profile.about)}</p>
        </Reveal>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {profile.stats.map((s, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass p-6 text-center">
              <Counter to={s.value} suffix={s.suffix} />
              <p className="mt-2 text-sm text-[var(--muted)]">{t(s.label)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Mount in `app/page.tsx`**

Replace the two stub sections:

```tsx
import Hero from '@/components/Hero'
import About from '@/components/About'
// inside <main>:
<section id="hero"><Hero /></section>
<section id="about" className="section-shell"><About /></section>
```

(Hero section drops `section-shell` — it manages its own full-viewport layout.)

- [ ] **Step 7: Verify**

Run: `npm run build`
Expected: PASS. Then `npm run dev`, open http://localhost:3000 — hero shows particles, typing effect, placeholder photo in gradient ring; about shows animated counters on scroll.

- [ ] **Step 8: Commit**

```bash
git add app components public
git commit -m "feat: add hero with particles/typing/photo and about with animated counters"
```

---

### Task 7: Skills + Experience timeline

**Files:**
- Create: `components/Skills.tsx`
- Create: `components/Experience.tsx`
- Modify: `app/page.tsx` (mount both)

**Interfaces:**
- Consumes: `skillGroups`, `marqueeTech`, `experiences` (Task 3), `useLang`, `Reveal`, CSS `.marquee-track` (Task 1).

- [ ] **Step 1: Create `components/Skills.tsx`**

```tsx
'use client'
import { useLang } from '@/lib/i18n'
import { skillGroups, marqueeTech } from '@/content/skills'
import Reveal from './Reveal'

export default function Skills() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Skill & Teknologi', en: 'Skills & Technologies' })}{' '}
          <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass h-full p-6">
              <h3 className="font-bold text-[var(--cyan)]">{t(g.title)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text)] transition-colors hover:border-[var(--violet)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="marquee-track gap-10">
          {[...marqueeTech, ...marqueeTech].map((tech, i) => (
            <span key={i} className="text-2xl font-extrabold whitespace-nowrap text-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/Experience.tsx`**

```tsx
'use client'
import { useLang } from '@/lib/i18n'
import { experiences } from '@/content/experience'
import Reveal from './Reveal'

export default function Experience() {
  const { t } = useLang()
  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Pengalaman Kerja', en: 'Work Experience' })} <span className="grad-text">.</span>
        </h2>
      </Reveal>

      <div className="relative mt-10 ml-3 border-l border-white/10 pl-8 md:ml-6">
        {experiences.map((e, i) => (
          <Reveal key={i} delay={0.1 * i} className="relative pb-12 last:pb-0">
            <span className="absolute top-1 -left-[41px] h-4 w-4 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] shadow-[0_0_16px_rgba(124,58,237,0.8)] md:-left-[41px]" />
            <p className="text-xs tracking-widest text-[var(--cyan)] uppercase">{e.period}</p>
            <h3 className="mt-1 text-xl font-bold text-white">{t(e.role)}</h3>
            <p className="text-sm text-[var(--muted)]">{e.company}</p>
            <ul className="mt-3 space-y-2">
              {e.points.map((p, j) => (
                <li key={j} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-[var(--violet)]">▸</span>
                  {t(p)}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Mount in `app/page.tsx`**

```tsx
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
// replace stubs:
<section id="skills" className="section-shell"><Skills /></section>
<section id="experience" className="section-shell"><Experience /></section>
```

- [ ] **Step 4: Verify**

Run: `npm run build` — PASS. Dev check: chips render grouped, marquee scrolls, timeline dots glow and reveal on scroll.

- [ ] **Step 5: Commit**

```bash
git add app components
git commit -m "feat: add skills chips with marquee and experience timeline"
```

---

### Task 8: Projects grid + modal + AI use cases

**Files:**
- Create: `components/Projects.tsx`
- Create: `components/ProjectModal.tsx`
- Create: `components/AiUseCases.tsx`
- Modify: `app/page.tsx` (mount both)

**Interfaces:**
- Consumes: `projects`, `aiUseCases`, `Project` type (Task 3), `useLang`, `Reveal`.

- [ ] **Step 1: Create `components/ProjectModal.tsx`**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Project } from '@/content/types'
import { useLang } from '@/lib/i18n'

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const { t } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = project
    ? [
        { label: { id: 'Masalah', en: 'Problem' }, body: project.problem },
        { label: { id: 'Solusi', en: 'Solution' }, body: project.solution },
        { label: { id: 'Arsitektur', en: 'Architecture' }, body: project.architecture },
        { label: { id: 'Dampak', en: 'Impact' }, body: project.impact },
      ]
    : []

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl p-6 sm:rounded-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/15 px-3 py-1 text-xs font-bold text-[#c4b5fd] uppercase">
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-white">{project.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-[var(--muted)] hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {rows.map((r, i) => (
              <div key={i} className="mt-5">
                <p className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
                  {t(r.label)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{t(r.body)}</p>
              </div>
            ))}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create `components/Projects.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/content/projects'
import type { Project, ProjectCategory } from '@/content/types'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'
import ProjectModal from './ProjectModal'

const FILTERS: { key: ProjectCategory | 'all'; label: { id: string; en: string } }[] = [
  { key: 'all', label: { id: 'Semua', en: 'All' } },
  { key: 'ai', label: { id: 'AI', en: 'AI' } },
  { key: 'banking', label: { id: 'Banking', en: 'Banking' } },
  { key: 'web', label: { id: 'Web', en: 'Web' } },
]

export default function Projects() {
  const { t } = useLang()
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')
  const [active, setActive] = useState<Project | null>(null)

  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Project', en: 'Projects' })} <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t({
            id: 'Klik kartu untuk detail: masalah, solusi, arsitektur, dampak.',
            en: 'Click a card for details: problem, solution, architecture, impact.',
          })}
        </p>
      </Reveal>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              filter === f.key
                ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] text-white'
                : 'glass text-[var(--muted)] hover:text-white'
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={0.06 * i}>
            <motion.button
              whileHover={{ y: -6 }}
              onClick={() => setActive(p)}
              className="glass block h-full w-full p-6 text-left transition-shadow hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]"
            >
              <span className="text-xs font-bold tracking-widest text-[var(--cyan)] uppercase">
                {p.category}
              </span>
              <h3 className="mt-2 text-lg font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{t(p.summary)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px]">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  )
}
```

- [ ] **Step 3: Create `components/AiUseCases.tsx`**

```tsx
'use client'
import { aiUseCases } from '@/content/aiUseCases'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'

export default function AiUseCases() {
  const { t } = useLang()
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--violet)]/20 blur-[100px]" />
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Use Case AI', en: 'AI Use Cases' })} <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          {t({
            id: 'Implementasi AI yang saya bangun dan jalankan — selalu dengan manusia dalam proses.',
            en: 'AI implementations I build and run — always with a human in the loop.',
          })}
        </p>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {aiUseCases.map((u, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div className="glass relative h-full overflow-hidden p-6">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)]" />
              <h3 className="font-bold text-white">{t(u.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t(u.description)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {u.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--cyan)]/30 px-2.5 py-0.5 text-[10px] text-[#67e8f9]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import Projects from '@/components/Projects'
import AiUseCases from '@/components/AiUseCases'
// replace stubs:
<section id="projects" className="section-shell"><Projects /></section>
<section id="ai" className="section-shell"><AiUseCases /></section>
```

- [ ] **Step 5: Verify**

Run: `npm run build` — PASS. Dev check: filter buttons work, card click opens modal, Escape closes, AI cards render.

- [ ] **Step 6: Commit**

```bash
git add app components
git commit -m "feat: add filterable project grid with detail modal and AI use case showcase"
```

---

### Task 9: Contact gate UI

**Files:**
- Create: `components/ContactGate.tsx`
- Modify: `app/page.tsx` (mount)

**Interfaces:**
- Consumes: `POST /api/contact` shapes from Task 4, `useLang`, `Reveal`.

- [ ] **Step 1: Create `components/ContactGate.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'

type Status = 'idle' | 'submitting' | 'revealed' | 'thanks' | 'error' | 'rate_limited'
type Contact = { email: string; whatsapp: string }

const PURPOSE_OPTIONS = [
  { value: 'recruitment', label: { id: 'Rekrutmen', en: 'Recruitment' } },
  { value: 'collaboration', label: { id: 'Kolaborasi Project', en: 'Project Collaboration' } },
  { value: 'consultation', label: { id: 'Konsultasi', en: 'Consultation' } },
  { value: 'other', label: { id: 'Lainnya', en: 'Other' } },
]

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--violet)]'

export default function ContactGate() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<Status>('idle')
  const [contact, setContact] = useState<Contact | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    purpose: 'recruitment',
    message: '',
    website: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setFieldErrors({})
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (res.status === 429) {
        setStatus('rate_limited')
      } else if (res.status === 422) {
        setFieldErrors(json.errors ?? {})
        setStatus('idle')
      } else if (res.ok && json.ok) {
        if (json.contact) {
          setContact(json.contact)
          setStatus('revealed')
        } else {
          setStatus('thanks')
        }
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const err = (k: string) =>
    fieldErrors[k] && (
      <p className="mt-1 text-xs text-rose-400">
        {t({ id: 'Isian belum valid.', en: 'This field is invalid.' })}
      </p>
    )

  return (
    <div className="relative">
      <Reveal>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {t({ id: 'Hubungi Saya', en: 'Get In Touch' })} <span className="grad-text">.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          {t({
            id: 'Isi form singkat ini — setelah terkirim, email & WhatsApp saya langsung terbuka untukmu.',
            en: 'Fill this short form — once submitted, my email & WhatsApp unlock instantly.',
          })}
        </p>
      </Reveal>

      <div className="mx-auto mt-10 max-w-xl">
        <AnimatePresence mode="wait">
          {status === 'revealed' && contact ? (
            <motion.div
              key="revealed"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 18 }}
              className="glass relative overflow-hidden p-8 text-center"
            >
              {!reduce &&
                Array.from({ length: 20 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      x: (i % 2 ? 1 : -1) * (30 + (i * 13) % 120),
                      y: -60 - ((i * 17) % 140),
                      rotate: (i * 47) % 360,
                    }}
                    transition={{ duration: 1.4, delay: 0.05 * i, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 text-lg"
                  >
                    {['✦', '✧', '⚡'][i % 3]}
                  </motion.span>
                ))}
              <p className="text-4xl">🎉</p>
              <h3 className="mt-3 text-xl font-extrabold text-white">
                {t({ id: 'Terhubung! Ini kontak saya:', en: 'Connected! Here is my contact:' })}
              </h3>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="glass px-6 py-3 text-sm font-bold text-[var(--cyan)] transition-colors hover:bg-white/10"
                >
                  ✉ {contact.email}
                </a>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
                  >
                    {t({ id: 'Chat WhatsApp Sekarang', en: 'Chat on WhatsApp Now' })}
                  </a>
                )}
              </div>
            </motion.div>
          ) : status === 'thanks' ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 text-center text-sm text-[var(--muted)]"
            >
              {t({ id: 'Terima kasih, pesanmu sudah diterima.', en: 'Thanks, your message was received.' })}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={false}
              exit={{ opacity: 0, y: -12 }}
              className="glass space-y-4 p-6 md:p-8"
            >
              <div>
                <input
                  className={inputCls}
                  placeholder={t({ id: 'Nama lengkap *', en: 'Full name *' })}
                  value={form.name}
                  onChange={set('name')}
                  required
                  minLength={2}
                  maxLength={100}
                />
                {err('name')}
              </div>
              <div>
                <input
                  className={inputCls}
                  type="email"
                  placeholder={t({ id: 'Email kamu *', en: 'Your email *' })}
                  value={form.email}
                  onChange={set('email')}
                  required
                  maxLength={200}
                />
                {err('email')}
              </div>
              <div>
                <input
                  className={inputCls}
                  placeholder={t({ id: 'Perusahaan / instansi (opsional)', en: 'Company / organization (optional)' })}
                  value={form.company}
                  onChange={set('company')}
                  maxLength={150}
                />
                {err('company')}
              </div>
              <div>
                <select className={inputCls} value={form.purpose} onChange={set('purpose')}>
                  {PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[var(--bg-soft)]">
                      {t(o.label)}
                    </option>
                  ))}
                </select>
                {err('purpose')}
              </div>
              <div>
                <textarea
                  className={inputCls}
                  rows={3}
                  maxLength={1000}
                  placeholder={t({ id: 'Pesan singkat (opsional)', en: 'Short message (optional)' })}
                  value={form.message}
                  onChange={set('message')}
                />
                {err('message')}
              </div>

              <input
                className="absolute -left-[9999px]"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                placeholder="website"
                value={form.website}
                onChange={set('website')}
              />

              {status === 'error' && (
                <p className="text-xs text-rose-400">
                  {t({
                    id: 'Gagal mengirim. Coba lagi sebentar lagi.',
                    en: 'Failed to send. Please try again shortly.',
                  })}
                </p>
              )}
              {status === 'rate_limited' && (
                <p className="text-xs text-amber-400">
                  {t({
                    id: 'Terlalu banyak percobaan. Tunggu beberapa menit ya.',
                    en: 'Too many attempts. Please wait a few minutes.',
                  })}
                </p>
              )}

              <motion.button
                whileTap={reduce ? undefined : { scale: 0.97 }}
                disabled={status === 'submitting'}
                className="w-full rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
              >
                {status === 'submitting'
                  ? t({ id: 'Mengirim…', en: 'Sending…' })
                  : t({ id: '🔓 Buka Kontak Saya', en: '🔓 Unlock My Contact' })}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mount in `app/page.tsx`**

```tsx
import ContactGate from '@/components/ContactGate'
// replace stub:
<section id="contact" className="section-shell"><ContactGate /></section>
```

- [ ] **Step 3: Create `.env.local` for dev (NOT committed)**

```
CONTACT_EMAIL=<GANTI_DENGAN_EMAIL_DUMMY>
CONTACT_WA=<GANTI_DENGAN_NOMOR_DUMMY>
```

Values are dummies for local testing only. Verify `.gitignore` already excludes `.env*`.

- [ ] **Step 4: Verify end-to-end locally**

Run: `npm run dev`. Submit form with valid data → contact card reveals with celebration; invalid email → field error; dev console shows "[contact] notification skipped".

- [ ] **Step 5: Run all tests + build**

```bash
npm test
npm run build
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add app components
git commit -m "feat: add gated contact form with reveal card and celebration"
```

---

### Task 10: Polish — SEO, env example, README, final verification

**Files:**
- Create: `.env.example`
- Modify: `README.md`
- Modify: `app/layout.tsx` (metadata already set in Task 5 — verify only)

**Interfaces:**
- Consumes: everything prior.

- [ ] **Step 1: Create `.env.example`**

```
# Kontak yang dibuka setelah pengunjung submit form (server-only, isi di Vercel)
CONTACT_EMAIL=<GANTI_DENGAN_EMAIL_KAMU>
CONTACT_WA=<GANTI_DENGAN_NOMOR_WA_KAMU_FORMAT_62>

# Notifikasi email via Resend (opsional — tanpa ini notif dilewati, kontak tetap terbuka)
RESEND_API_KEY=<GANTI_DENGAN_API_KEY_RESEND>
NOTIF_TO_EMAIL=<GANTI_DENGAN_EMAIL_PENERIMA_NOTIF>
```

- [ ] **Step 2: Replace `README.md`**

```markdown
# Personal Profile — Yoga Daswara

Portfolio one-page (Next.js + Tailwind + Framer Motion). Kontak digerbang form; konten dua bahasa (ID/EN) dari file data.

## Menjalankan lokal

    npm install
    cp .env.example .env.local   # isi nilai dummy untuk dev
    npm run dev                  # http://localhost:3000

## Update konten

Semua konten di folder `content/` — edit lalu push, Vercel deploy otomatis:

| File | Isi |
|------|-----|
| `content/profile.ts` | Nama, role typing effect, tagline, about, statistik |
| `content/skills.ts` | Kelompok skill + daftar marquee |
| `content/experience.ts` | Riwayat kerja (timeline) |
| `content/projects.ts` | Kartu project + detail modal |
| `content/aiUseCases.ts` | Showcase use case AI |

Format teks dua bahasa: `{ id: 'Teks Indonesia', en: 'English text' }`.

Foto profil: ganti `public/profile.jpg` (rasio 1:1 disarankan). Tanpa file itu, placeholder tampil.

## Deploy (Vercel)

1. Push repo ke GitHub.
2. Import di vercel.com → framework terdeteksi otomatis.
3. Set Environment Variables sesuai `.env.example` (nilai asli hanya di Vercel, jangan di repo).
4. Deploy. Selesai — tiap push ke branch utama = deploy ulang.

## Keamanan

- Email/WA hanya di env var server, tidak pernah ada di bundle client.
- Form: honeypot + rate limit 5 request / 10 menit / IP.
- Notifikasi Resend best-effort: gagal kirim tidak memblokir reveal.
```

- [ ] **Step 3: Final verification pass**

```bash
npm test
npm run build
```

Expected: PASS. Then `npm run dev` and verify manually:
- Mobile viewport (devtools 375px): navbar hamburger, grid 1 kolom, timeline rapi.
- Tablet 768px: grid 2 kolom.
- Language toggle mengubah seluruh section dan tersimpan setelah reload.
- Emulasi `prefers-reduced-motion: reduce`: partikel hilang, reveal tanpa slide, typing statis.
- Form gate happy path + error path.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add env example, README content guide, final polish"
```

---

## Deployment (user-driven, after implementation)

Guided steps for the user (not automated): create GitHub repo → push → import to Vercel → set real env vars (`CONTACT_EMAIL`, `CONTACT_WA`, `RESEND_API_KEY`, `NOTIF_TO_EMAIL`) → deploy → optionally add custom domain. Real contact values never enter the repo.
