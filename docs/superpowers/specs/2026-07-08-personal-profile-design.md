# Personal Profile Web — Yoga Daswara — Design Spec

Date: 2026-07-08
Status: Approved by user (visual style, layout, stack, contact flow, i18n, content strategy)

## Goal

Personal profile / portfolio web app for Yoga Daswara (IT — Bank Sahabat Sampoerna). Visitors can browse experience, projects, and AI use cases freely, but contact details (email, WhatsApp) are gated behind a form. Gen Z "dark neon" visual style, heavily animated, fully responsive, content editable via data files.

## Decisions (user-approved)

| Area | Decision |
|------|----------|
| Visual style | Dark Neon / Futuristic — dark bg `#0a0a14`-family, violet–cyan gradient accents, glassmorphism cards, particle canvas, glow effects |
| Layout | One-page scroll story; project detail via modal/overlay |
| Stack | Next.js (App Router) + Tailwind CSS + Framer Motion |
| Hosting | Vercel free tier, auto-deploy from GitHub push |
| Content management | Data files in `content/` (TypeScript), edit → push → redeploy |
| Language | Bilingual toggle ID/EN, every string as `{ id, en }`, persisted in localStorage |
| Contact flow | Gate form → on valid submit, contact card revealed (email + WhatsApp deep link) + notification email sent to Yoga |
| Projects content | 6 realistic placeholders (banking IT + AI flavored), user edits later |
| Photo | Profile photo in Hero (gradient ring frame, hover tilt) + small in About; file at `public/profile.jpg` (user provides; placeholder until then) |

## Architecture

- **Next.js App Router**, mostly static/client components; one server API route.
- **`POST /api/contact`**: validates payload (name, email, purpose required), honeypot check, sends notification email via Resend (best-effort — failure does NOT block reveal), returns contact details `{ email, whatsapp }` read from server env vars.
- **Secrets/env (server-only, never in client bundle):** `CONTACT_EMAIL`, `CONTACT_WA`, `RESEND_API_KEY`, `NOTIF_TO_EMAIL`. Placeholders in `.env.example`; real values only in Vercel env settings.
- **Content layer:** `content/` folder — `profile.ts`, `experience.ts`, `projects.ts`, `skills.ts`, `aiUseCases.ts`. Each display string is `{ id: string, en: string }`. A small `useLang()` context provides current language + `t()` helper.

## Page Sections (single page, scroll order)

1. **Hero** — large gradient name, rotating typing effect (roles), particle canvas background, profile photo in glowing gradient ring with hover tilt, scroll CTA.
2. **About** — summary from CV, small photo, animated stat counters (years experience, projects, AI use cases).
3. **Skills** — glass chips grouped by category + scrolling marquee of tech names.
4. **Experience** — vertical timeline from CV data, scroll-reveal per item.
5. **Projects** — responsive card grid, category filter (AI / Banking / Web / All). Card click opens modal: problem, solution, architecture summary, tech stack, impact/result. 6 placeholder entries marked clearly as examples.
6. **AI Use Cases** — dedicated showcase section (distinct visual treatment) for implemented AI use cases.
7. **Contact Gate** — form fields:
   - Nama / Name (required)
   - Email (required, validated)
   - Perusahaan/Instansi / Company (optional)
   - Keperluan / Purpose (required dropdown: Rekrutmen | Kolaborasi Project | Konsultasi | Lainnya)
   - Pesan / Message (optional, short)
   - Hidden honeypot field
   On success: contact card animates open (email + `wa.me` button), celebration animation. On API failure (network/server): clear error message + retry; rate-limited responses show a polite wait message.
8. **Footer** — minimal, language toggle also in navbar.

## Animation Spec

Framer Motion throughout: staggered scroll reveals, hover glow/lift on cards, magnetic buttons, smooth scroll navigation, page-load intro sequence, animated counters, particle canvas in hero. Must respect `prefers-reduced-motion` (disable/simplify all non-essential motion). Target 60fps — transform/opacity animations only.

## Responsive

Mobile-first. Breakpoints: mobile (<640), tablet (640–1024), desktop (>1024). Navbar collapses to floating menu on mobile; project grid 1/2/3 columns; timeline switches to single-rail on mobile.

## Error Handling

- Client + server validation on form; field-level error messages (bilingual).
- Notification email is best-effort: Resend failure logged server-side, contact still revealed.
- API route returns structured errors; no stack traces to client.
- Honeypot-filled submissions return fake success (no reveal data misuse — return success shape without contact? No: return success WITH contact omitted is detectable; instead: silently accept and skip notification, still return contact — bots gain nothing valuable beyond public-ish contact; primary goal is notification spam prevention). Decision: honeypot hit → 200 with generic success, contact NOT included, UI shows generic thanks.

## Testing / Verification

- `next build` passes; manual verification of all sections desktop + mobile viewport.
- Form flow verified end-to-end locally with mocked Resend (env var absent → log-only mode).
- Language toggle verified across all sections.
- `prefers-reduced-motion` emulation check.

## Out of Scope (YAGNI)

Admin panel, database, analytics, blog, CMS integration, multi-page routing, auth.

## Content placeholders

6 example projects (chatbot/RAG internal assistant, document OCR pipeline, transaction API service, monitoring dashboard, AI report automation, internal portal) written generically — **no real BSS internal system names, no network topology, no production identifiers**. User replaces with real, sanitized descriptions later.

## Deployment (guided later, user actions)

GitHub repo → import to Vercel → set env vars (real contact values + Resend key) → deploy. Local dev uses `.env.local` with dummy values.
