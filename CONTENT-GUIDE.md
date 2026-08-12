# Panduan Update Konten

> **Situs ini punya dua tampilan, satu sumber konten.** `/` menampilkan dunia 3D
> kalau perangkat pengunjung mampu, dan `/text` selalu menampilkan versi teks
> biasa. Keduanya membaca file yang sama di `content/` - edit sekali, dua-duanya
> ikut berubah. Tidak ada konten yang perlu ditulis dua kali.
>
> Pengunjung otomatis dapat versi teks kalau: mengaktifkan *reduce motion* di OS,
> browsernya tanpa WebGL2, atau perangkatnya tidak sanggup 30fps. Aturan lengkap
> ada di `lib/webgl/capability.ts`.

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
  logo: '/logos/nama-file.svg',        // opsional, lihat catatan di bawah
  role: { id: 'Jabatan (Indonesia)', en: 'Job Title (English)' },
  period: 'Mar 2023 - Sekarang / Present',
  points: [
    { id: 'Poin pencapaian 1', en: 'Achievement point 1' },
    { id: 'Poin pencapaian 2', en: 'Achievement point 2' },
  ],
},
```

**Logo perusahaan (`logo`)** opsional. Kalau diisi, taruh file gambarnya di
`public/logos/` dan tulis path-nya mulai dari `/logos/...`. Kalau dikosongkan
(atau field-nya dihapus), timeline tetap tampil normal tanpa logo. Ukuran
tampil kecil (36px), jadi SVG atau PNG persegi paling rapi.

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

Tiap skill butuh `name` dan `level`. `level` cuma boleh salah satu dari
`'expert'`, `'advanced'`, `'intermediate'` - dipakai untuk warna badge dan
legenda di atas kartu.

```ts
export const skillGroups = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: [
      { name: '.NET Core', level: 'expert' },
      { name: 'Golang', level: 'advanced' },
      { name: 'Python', level: 'intermediate' },
    ],
  },
]

export const marqueeTech = ['.NET Core', 'Golang', 'GCP', 'Docker']
```

Patokan level yang dipakai sekarang: `expert` = 5+ tahun pakai rutin,
`advanced` = 3+ tahun, `intermediate` = 1-3 tahun.

**Contoh tambah kelompok skill baru:**
```ts
{
  title: { id: 'Keamanan', en: 'Security' },
  items: [
    { name: 'OWASP', level: 'advanced' },
    { name: 'IAM', level: 'expert' },
  ],
},
```

`marqueeTech` tetap daftar teks biasa (tanpa `level`), isinya highlight
pilihan untuk teks berjalan - tidak harus semua skill dimasukkan.

---

## 4. `content/certifications.ts` - Sertifikasi

Tampil di bawah section Skills.

```ts
{ title: 'Nama Sertifikasi', issuer: 'Penerbit', year: '2024' },
```

`year` boleh dikosongkan `''` kalau tidak ingin tampilkan tahun.

`url` opsional. Kalau diisi, judul sertifikasi jadi link (buka tab baru,
ada penanda `↗`). Kalau dikosongkan, tampil sebagai teks biasa.

```ts
{
  title: 'Google Cloud Fundamentals',
  issuer: 'Google Cloud',
  year: '2023',
  url: 'https://cloud.google.com/training',   // opsional
},
```

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

Tiap project = 1 kartu di section Project + **1 halaman detail sendiri** di
`/projects/<slug>`. Klik kartu langsung pindah ke halaman itu.

```ts
{
  slug: 'nama-unik-tanpa-spasi',      // JADI URL PUBLIK, lihat catatan di bawah
  title: 'Nama Project',
  category: 'ai',                     // pilih salah satu: 'ai' | 'banking' | 'web'
  summary: { id: '...', en: '...' },       // 1 kalimat, tampil di kartu
  problem: { id: '...', en: '...' },       // di halaman detail: masalah yang diselesaikan
  solution: { id: '...', en: '...' },      // solusi yang dibangun
  architecture: { id: '...', en: '...' },  // ringkasan arsitektur teknis
  tech: ['Python', 'GCP', 'Kafka'],        // daftar teknologi, tampil sebagai chip
  impact: { id: '...', en: '...' },        // hasil/dampak - pakai angka kalau ada
},
```

**Soal `slug` - ini bukan sekadar key internal.** Slug jadi alamat halaman
(`/projects/loan-origination-system`) dan ikut masuk `sitemap.xml`. Jadi:

- huruf kecil, pakai strip, tanpa spasi/karakter aneh
- wajib unik antar project
- kalau slug diganti setelah situs live, link lama yang sudah tersebar jadi
  mati (404). Kalau bisa, jangan diubah lagi setelah dipublikasikan.

**Kalau mau kategori baru** (misal `'mobile'`), tidak cukup tulis di sini -
`category` tipenya terbatas 3 nilai, jadi TypeScript akan menolak. Perlu
ubah 3 tempat: `ProjectCategory` di `content/types.ts`, `COVER_STYLES` di
`components/Projects.tsx` (warna header kartu), dan array `FILTERS` di file
yang sama (tombol filter). Bilang saja kalau perlu, saya tambahkan.

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

Tambah/hapus entri langsung di array - jumlah kartu ikut menyesuaikan, dan
angka stat "Project Dikembangkan" di About ikut berubah sendiri.

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

## 8. `content/education.ts` - Riwayat pendidikan

Tampil di section About. Semua field teks biasa, tidak perlu `{ id, en }`.

```ts
{ school: 'Nama Kampus - Kota', degree: 'S1 Information Systems', period: '2020 - 2022' },
```

---

## 9. `content/moments.ts` - Foto momen/aktivitas

Galeri kecil di section About. Taruh file fotonya di `public/photos/`, lalu
tulis path-nya mulai dari `/photos/...`.

```ts
{
  src: '/photos/nama-file.jpeg',
  caption: { id: 'Keterangan foto', en: 'Photo caption' },
},
```

---

## 10. `content/organization.ts` - Struktur departemen

Tampil di section "Tim" (`#org`), antara About dan Skill. Dua bagian: `department`
(kotak departemen paling atas) dan `orgUnits` (bagian-bagian di bawahnya).

```ts
export const department = {
  name: { id: 'IT Architecture & Engineering', en: '...' },
  role: { id: 'Department Head', en: '...' },
  summary: { id: 'Paragraf pembuka section', en: '...' },
}

export const orgUnits = [
  {
    key: 'system-engineer',          // id unik, jangan diubah sembarangan
    name: { id: 'IT System Engineer', en: '...' },
    accent: 'cyan',                  // 'cyan' | 'violet' | 'emerald'
    headcount: 3,                    // jumlah orang; 0 = angka disembunyikan
    focus: { id: 'Satu kalimat: bagian ini pegang apa', en: '...' },
    scope: [                         // 2-4 item paling enak dibaca
      { id: 'Tanggung jawab pertama', en: '...' },
    ],
  },
]
```

**Aturan penting - jangan tulis nama orang di file ini.** Situs ini publik.
Nama karyawan adalah data internal, dan jumlah posisi kosong (*vacant*)
membocorkan kondisi headcount ke luar. Cukup `headcount`. Ada test otomatis
(`lib/__tests__/organization.test.ts`) yang gagal kalau kata "vacant" masuk atau
ada field baru di luar daftar di atas.

`accent` menentukan warna dan motif background bagian itu, dan urutannya
menentukan pergeseran tema saat halaman di-scroll. Tiap bagian harus pakai
`accent` yang berbeda - kalau kembar, test gagal.

Kalau menambah bagian keempat, warna yang tersedia habis. Tambah dulu variabel
warna baru di `app/globals.css`, lalu daftarkan di `OrgAccent`
(`content/types.ts`) dan `ACCENT_HEX` (`components/OrgStructure.tsx`).

Ubah jumlah orang di sini juga otomatis mengubah total "engineer" di kotak
departemen - tidak ada angka total yang diisi manual.

---

## 11. Foto profil

Ganti file `public/profile.png`. Tidak perlu ubah kode - nama file harus tetap
`profile.png`.

Satu file ini dipakai dua tempat dengan potongan berbeda:

- **Desktop:** potret besar di kanan Hero, jadi potret setengah/full badan cocok
- **Mobile:** avatar bulat 112px, dipotong dari bagian **atas** gambar

Karena versi mobile dipotong bulat dari atas, pastikan wajah ada di area atas
foto. Foto full badan dengan wajah kecil di tengah akan terlihat aneh saat
dipotong jadi bulat. Background gelap paling nyatu ke tema.

## 12. File CV

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
| Riwayat pendidikan | `content/education.ts` |
| Struktur departemen & jumlah anggota | `content/organization.ts` |
| Foto momen/aktivitas | `content/moments.ts` |
| Foto profil | `public/profile.png` |
| Logo perusahaan | `public/logos/` |
| Foto momen (file gambar) | `public/photos/` |
| File CV | `public/cv/yoga-daswara-cv.pdf` |

---

## Kalau salah bentuk, ketahuan sebelum live

File-file ini TypeScript (`.ts`), bukan JSON. Jadi kalau ada field yang kurang,
salah nama, atau `level` diisi nilai yang tidak dikenal, **build Vercel gagal
dan situs lama tetap jalan** - bukan deploy halaman rusak. Pesan errornya
menyebut file dan barisnya.

Mau cek dulu sebelum push, dari root project:

```bash
npx tsc --noEmit
```

Dua kesalahan yang paling sering:

- **Lupa `en` atau `id`** pada field dua bahasa. Keduanya wajib ada.
- **Skill ditulis sebagai teks biasa** (`items: ['Golang']`) padahal sekarang
  harus objek (`items: [{ name: 'Golang', level: 'advanced' }]`).
