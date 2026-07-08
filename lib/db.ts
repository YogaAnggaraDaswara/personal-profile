import { sql } from '@vercel/postgres'

// Different Postgres integrations (Vercel Postgres, Neon marketplace, etc.) inject the
// connection string under different env var names. @vercel/postgres only reads POSTGRES_URL,
// so mirror whichever variant is present into it before the first query.
function resolveConnectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED
  )
}

function isConfigured(): boolean {
  const conn = resolveConnectionString()
  if (!conn) return false
  if (!process.env.POSTGRES_URL) process.env.POSTGRES_URL = conn
  return true
}

let tablesReady = false

async function ensureTables(): Promise<void> {
  if (tablesReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      purpose TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS cv_leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      purpose TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  // Self-heal older deployments where cv_leads already existed without these columns.
  await sql`ALTER TABLE cv_leads ADD COLUMN IF NOT EXISTS company TEXT`
  await sql`ALTER TABLE cv_leads ADD COLUMN IF NOT EXISTS purpose TEXT`
  tablesReady = true
}

export async function saveContactSubmission(v: {
  name: string
  email: string
  company: string
  purpose: string
  message: string
}): Promise<void> {
  if (!isConfigured()) {
    console.log('[db] skipped saving contact submission (no Postgres connection string configured)')
    return
  }
  try {
    await ensureTables()
    await sql`
      INSERT INTO contact_submissions (name, email, company, purpose, message)
      VALUES (${v.name}, ${v.email}, ${v.company}, ${v.purpose}, ${v.message})
    `
  } catch (err) {
    console.error('[db] failed to save contact submission', err)
  }
}

export async function saveCvLead(v: {
  name: string
  email: string
  phone: string
  company: string
  purpose: string
}): Promise<void> {
  if (!isConfigured()) {
    console.log('[db] skipped saving cv lead (no Postgres connection string configured)')
    return
  }
  try {
    await ensureTables()
    await sql`
      INSERT INTO cv_leads (name, email, phone, company, purpose)
      VALUES (${v.name}, ${v.email}, ${v.phone}, ${v.company}, ${v.purpose})
    `
  } catch (err) {
    console.error('[db] failed to save cv lead', err)
  }
}
