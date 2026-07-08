# Panduan Update Konten

Semua isi web ini (teks, foto, project, sosial media, CV) ada di file-file dalam folder `content/`. Edit file, simpan, `git push` - Vercel deploy ulang otomatis. Tidak perlu sentuh kode React sama sekali.

Format teks dua bahasa selalu begini:

```ts
{ id: 'Teks Bahasa Indonesia', en: 'Text in English' }
```

Isi `id` untuk versi Indonesia, `en` untuk versi Inggris. Field lain (nama, URL, angka) cukup satu nilai, tidak perlu `{ id, en }`.

---

## 1. `content/profile.ts` - Data diri utama

Isinya: nama, jabatan yang muncul efek ketik di Hero, tagline, paragraf About, jumlah tahun pengalaman, path file CV, dan link sosial media.

```ts
export const profile = {
  name: 'Yoga Daswara',
  typingRoles: ['Head of IT Architecture', 'System Architect', 'Banking Tech Leader'], // muncul bergantian efek ketik
  tagline: { id: '...', en: '...' },   // kalimat pendek di bawah nama, Hero section
  about: { id: '...', en: '...' },     // paragraf panjang di section "Tentang Saya"
  stats: [
    { value: 10, suffix: '+', label: { id: 'Tahun Pengalaman', en: 'Years of Experience' } },
  ],
  cvFile: '/cv/yoga-daswara-cv.pdf',
}

export const socials = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/USERNAME', icon: 'linkedin' },
  { label: 'GitHub', url: 'https://github.com/USERNAME', icon: 'github' },
  { label: 'Instagram', url: 'https://instagram.com/USERNAME', icon: 'instagram' },
]
```

**Contoh ganti tagline:**
```ts
tagline: {
  id: 'Membangun sistem perbankan yang tangguh dan aman.',
  en: 'Building resilient and secure banking systems.',
},
```

**Catatan stat otomatis:** "Project Dikembangkan" dan "Use Case AI" di section About **tidak** diedit di sini - angka itu otomatis dihitung dari jumlah entri di `content/projects.ts` dan `content/aiUseCases.ts`. Tambah/hapus project di file itu, angkanya ikut berubah sendiri. Hanya "Tahun Pengalaman" yang diisi manual di atas.

`icon` untuk sosial media cuma boleh: `'linkedin'`, `'github'`, atau `'instagram'` (baru tersedia 3 ini).

---

## 2. `content/experience.ts` - Riwayat kerja (timeline)

Array `experiences`, urutan dari yang **terbaru ke terlama** (tampil sesuai urutan array).

```ts
{
  company: 'Nama Perusahaan',
  role: { id: 'Jabatan (Indonesia)', en: 'Job Title (English)' },
  period: 'Mar 2023 - Sekarang / Present',
  points: [
    { id: 'Poin pencapaian 1', en: 'Achievement point 1' },
    { id: 'Poin pencapaian 2', en: 'Achievement point 2' },
  ],
},
```

**Contoh tambah pengalaman baru** (taruh paling atas array kalau itu kerjaan terbaru):
```ts
{
  company: 'Perusahaan Baru',
  role: { id: 'Solutions Architect', en: 'Solutions Architect' },
  period: 'Jan 2027 - Sekarang / Present',
  points: [
    { id: 'Deskripsi tanggung jawab utama.', en: 'Main responsibility description.' },
  ],
},
```

---

## 3. `content/skills.ts` - Skill & teknologi

Dua bagian: `skillGroups` (kartu skill dikelompokkan) dan `marqueeTech` (teks berjalan di bawahnya).

```ts
export const skillGroups = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: ['.NET Core', 'Golang', 'Python'], // daftar teks biasa, tanpa {id,en}
  },
]

export const marqueeTech = ['.NET Core', 'Golang', 'GCP', 'Docker']
```

**Contoh tambah kelompok skill baru:**
```ts
{
  title: { id: 'Keamanan', en: 'Security' },
  items: ['OWASP', 'Penetration Testing', 'IAM'],
},
```

---

## 4. `content/certifications.ts` - Sertifikasi

Tampil di bawah section Skills.

```ts
{ title: 'Nama Sertifikasi', issuer: 'Penerbit', year: '2024' },
```

`year` boleh dikosongkan `''` kalau tidak ingin tampilkan tahun.

---

## 5. `content/testimonials.ts` - Testimoni / rekomendasi

Quote dari rekan kerja/atasan, tampil di section About. Ambil dari LinkedIn Recommendations atau sumber lain.

```ts
{
  quote: { id: 'Kutipan testimoni...', en: 'Testimonial quote...' },
  name: 'Nama Pemberi Testimoni',
  role: { id: 'Jabatan mereka', en: 'Their role' },
},
```

Tambah entri baru langsung ke array `testimonials` - semua akan tampil berurutan.

---

## 6. `content/projects.ts` - Project showcase

Ini yang **paling penting diganti** dari placeholder ke project nyata kamu. Tiap project = 1 kartu di section Project + 1 modal detail saat diklik.

```ts
{
  slug: 'nama-unik-tanpa-spasi',      // untuk key internal, huruf kecil + strip
  title: 'Nama Project',
  category: 'ai',                     // pilih salah satu: 'ai' | 'banking' | 'web'
  summary: { id: '...', en: '...' },       // 1 kalimat, tampil di kartu
  problem: { id: '...', en: '...' },       // tampil di modal: masalah apa yang diselesaikan
  solution: { id: '...', en: '...' },      // solusi yang dibangun
  architecture: { id: '...', en: '...' },  // ringkasan arsitektur teknis
  tech: ['Python', 'GCP', 'Kafka'],        // daftar teknologi, tampil sebagai chip
  impact: { id: '...', en: '...' },        // hasil/dampak - pakai angka kalau ada
},
```

**Contoh project nyata:**
```ts
{
  slug: 'loan-origination-system',
  title: 'Loan Origination & Collection System',
  category: 'banking',
  summary: {
    id: 'Sistem loan origination untuk mempercepat proses pinjaman.',
    en: 'Loan origination system to speed up the lending process.',
  },
  problem: {
    id: 'Proses pinjaman manual memakan waktu lama dan rawan error.',
    en: 'Manual loan processing was slow and error-prone.',
  },
  solution: {
    id: 'Membangun sistem end-to-end dari pengajuan sampai pencairan dengan tim 5 developer.',
    en: 'Built an end-to-end system from application to disbursement with a team of 5 developers.',
  },
  architecture: {
    id: 'Arsitektur .NET dengan integrasi API ke sistem core banking.',
    en: '.NET architecture integrated via API with the core banking system.',
  },
  tech: ['.NET', 'ASP.NET', 'MSSQL'],
  impact: {
    id: 'Waktu proses pinjaman turun 30%.',
    en: 'Loan processing time reduced by 30%.',
  },
},
```

Hapus seluruh isi array lama (masih placeholder generic) dan ganti dengan project asli satu per satu - jumlah kartu akan otomatis mengikuti (dan ikut update angka stat "Project Dikembangkan" di About).

---

## 7. `content/aiUseCases.ts` - Showcase use case AI

Mirip project tapi lebih ringkas, khusus highlight implementasi AI.

```ts
{
  title: { id: '...', en: '...' },
  description: { id: '...', en: '...' },
  tech: ['LLM API', 'Python'],
},
```

Jumlah entri di sini otomatis jadi angka stat "Use Case AI" di About.

---

## 8. Foto profil

Ganti file `public/profile.png` (potret setengah/full badan, background gelap paling nyatu ke tema dark neon). Tidak perlu ubah kode - nama file harus tetap `profile.png`.

## 9. File CV

Ganti file `public/cv/yoga-daswara-cv.pdf` dengan CV versi terbaru. Nama file harus tetap sama persis (`yoga-daswara-cv.pdf`), karena direferensikan langsung di `content/profile.ts` (`cvFile`) dan `app/api/cv-lead/route.ts` (`downloadUrl`). Kalau mau ganti nama file, dua tempat itu juga harus diubah.

---

## Ringkasan lokasi cepat

| Mau ubah apa? | File |
|---|---|
| Nama, tagline, about, tahun pengalaman, sosial media | `content/profile.ts` |
| Riwayat kerja | `content/experience.ts` |
| Skill & teknologi | `content/skills.ts` |
| Sertifikasi | `content/certifications.ts` |
| Testimoni/rekomendasi | `content/testimonials.ts` |
| Project showcase | `content/projects.ts` |
| Use case AI | `content/aiUseCases.ts` |
| Foto profil | `public/profile.png` |
| File CV | `public/cv/yoga-daswara-cv.pdf` |
