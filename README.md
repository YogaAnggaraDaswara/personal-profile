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
2. Import di vercel.com — framework terdeteksi otomatis.
3. Set Environment Variables sesuai `.env.example` (nilai asli hanya di Vercel, jangan di repo).
4. Deploy. Selesai — tiap push ke branch utama = deploy ulang.

## Keamanan

- Email/WA hanya di env var server, tidak pernah ada di bundle client.
- Form: honeypot + rate limit 5 request / 10 menit / IP.
- Notifikasi Resend best-effort: gagal kirim tidak memblokir reveal.
