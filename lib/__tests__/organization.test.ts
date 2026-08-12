import { describe, it, expect } from 'vitest'
import { department, orgUnits } from '@/content/organization'
import type { Bi } from '@/lib/i18n-core'

const ACCENTS = ['cyan', 'violet', 'emerald']

/** Both languages must be filled or the site falls back to Indonesian silently. */
function expectBilingual(b: Bi, where: string) {
  expect(b.id.trim(), `${where}.id`).not.toBe('')
  expect(b.en.trim(), `${where}.en`).not.toBe('')
}

describe('department', () => {
  it('has bilingual name, role, and summary', () => {
    expectBilingual(department.name, 'department.name')
    expectBilingual(department.role, 'department.role')
    expectBilingual(department.summary, 'department.summary')
  })
})

describe('orgUnits', () => {
  it('is not empty', () => {
    expect(orgUnits.length).toBeGreaterThan(0)
  })

  it('uses unique keys', () => {
    const keys = orgUnits.map((u) => u.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('uses a distinct known accent per unit so the scroll theme can shift', () => {
    const accents = orgUnits.map((u) => u.accent)
    for (const a of accents) expect(ACCENTS).toContain(a)
    expect(new Set(accents).size).toBe(accents.length)
  })

  it('has non-negative whole headcounts', () => {
    for (const u of orgUnits) {
      expect(Number.isInteger(u.headcount), `${u.key} headcount is an integer`).toBe(true)
      expect(u.headcount, `${u.key} headcount`).toBeGreaterThanOrEqual(0)
    }
  })

  it('has bilingual name, focus, and scope for every unit', () => {
    for (const u of orgUnits) {
      expectBilingual(u.name, `${u.key}.name`)
      expectBilingual(u.focus, `${u.key}.focus`)
      expect(u.scope.length, `${u.key}.scope`).toBeGreaterThan(0)
      u.scope.forEach((s, i) => expectBilingual(s, `${u.key}.scope[${i}]`))
    }
  })

  // The site is public. Publishing staff names is what this guards against.
  it('carries no personal names, only headcounts', () => {
    const text = JSON.stringify(orgUnits) + JSON.stringify(department)
    expect(text).not.toMatch(/\bvacant\b/i)
    for (const key of Object.keys(orgUnits[0])) {
      expect(['key', 'name', 'accent', 'headcount', 'focus', 'scope']).toContain(key)
    }
  })
})
