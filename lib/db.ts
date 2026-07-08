import { sql } from '@vercel/postgres'

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
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  tablesReady = true
}

export async function saveContactSubmission(v: {
  name: string
  email: string
  company: string
  purpose: string
  message: string
}): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    console.log('[db] skipped saving contact submission (POSTGRES_URL not set)')
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

export async function saveCvLead(v: { name: string; email: string; phone: string }): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    console.log('[db] skipped saving cv lead (POSTGRES_URL not set)')
    return
  }
  try {
    await ensureTables()
    await sql`
      INSERT INTO cv_leads (name, email, phone)
      VALUES (${v.name}, ${v.email}, ${v.phone})
    `
  } catch (err) {
    console.error('[db] failed to save cv lead', err)
  }
}
