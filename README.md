# Personal Profile - Yoga Daswara

Portfolio one-page (Next.js + Tailwind + Framer Motion). Kontak digerbang form; konten dua bahasa (ID/EN) dari file data.

## Menjalankan lokal

    npm install
    cp .env.example .env.local   # isi nilai dummy untuk dev
    npm run dev                  # http://localhost:3000

## Update konten

Semua konten di folder `content/` - edit lalu push, Vercel deploy otomatis:

| File | Isi |
|------|-----|
| `content/profile.ts` | Nama, role typing effect, tagline, about, statistik |
| `content/skills.ts` | Kelompok skill + daftar marquee |
| `content/experience.ts` | Riwayat kerja (timeline) |
| `content/projects.ts` | Kartu project + detail modal |
| `content/aiUseCases.ts` | Showcase use case AI |

Format teks dua bahasa: `{ id: 'Teks Indonesia', en: 'English text' }`.

Foto profil: ganti `public/profile.png` (potret setengah/full badan, background gelap paling nyatu ke tema). Tanpa file itu, placeholder tampil.

Sosial media: edit array `socials` di `content/profile.ts` (LinkedIn, GitHub, Instagram - ganti URL ke akun asli).

CV: taruh file PDF di `public/cv/yoga-daswara-cv.pdf`. Tombol "Download CV" minta nama, email, No. HP dulu (masuk ke notifikasi email jika `RESEND_API_KEY`+`NOTIF_TO_EMAIL` diisi) baru link unduh muncul. Nama file bisa diganti - cukup ubah `cvFile` di `content/profile.ts` dan path di `app/api/cv-lead/route.ts`.

## Deploy (Vercel)

1. Push repo ke GitHub.
2. Import di vercel.com - framework terdeteksi otomatis.
3. Set Environment Variables sesuai `.env.example` (nilai asli hanya di Vercel, jangan di repo).
4. Deploy. Selesai - tiap push ke branch utama = deploy ulang.

## Keamanan

- Email/WA hanya di env var server, tidak pernah ada di bundle client.
- Form kontak & form unduh CV: honeypot + rate limit 5 request / 10 menit / IP.
- File CV di `public/` bisa diakses langsung kalau URL ditebak - form ini gerbang soft (capture lead), bukan proteksi keamanan berkas.
- Notifikasi Resend best-effort: gagal kirim tidak memblokir reveal.
