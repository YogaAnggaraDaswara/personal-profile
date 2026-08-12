import { describe, it, expect } from 'vitest'
import {
  ACCENT,
  BUDGET,
  CORRIDOR_LENGTH,
  PLACES,
  SPACING,
  WORLD_SCREENS,
  locate,
  placeById,
} from '@/components/world/theme'

describe('PLACES', () => {
  it('uses unique ids', () => {
    const ids = PLACES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('numbers depths consecutively from zero so the corridor has no gaps', () => {
    expect(PLACES.map((p) => p.depth)).toEqual(PLACES.map((_, i) => i))
  })

  it('points every place at a known accent', () => {
    for (const p of PLACES) expect(Object.keys(ACCENT)).toContain(p.accent)
  })

  it('maps every place to a distinct DOM section id', () => {
    const domIds = PLACES.map((p) => p.domId)
    expect(new Set(domIds).size).toBe(domIds.length)
  })
})

describe('corridor geometry', () => {
  it('spans one spacing per gap between places', () => {
    expect(CORRIDOR_LENGTH).toBe((PLACES.length - 1) * SPACING)
  })

  it('asks for one screen of scroll per place', () => {
    expect(WORLD_SCREENS).toBe(PLACES.length)
  })
})

describe('locate', () => {
  it('returns the first place at the corridor start', () => {
    expect(locate(0).place.id).toBe('arrival')
    expect(locate(0).blend).toBe(0)
  })

  it('lands exactly on a place at its own depth', () => {
    const target = PLACES[3]
    const at = locate(-target.depth * SPACING)
    expect(at.place.id).toBe(target.id)
    expect(at.blend).toBeCloseTo(0)
  })

  it('blends halfway between two places', () => {
    const at = locate(-SPACING * 1.5)
    expect(at.place.id).toBe(PLACES[1].id)
    expect(at.next.id).toBe(PLACES[2].id)
    expect(at.blend).toBeCloseTo(0.5)
  })

  it('clamps past the far end instead of running off the list', () => {
    const at = locate(-CORRIDOR_LENGTH * 4)
    expect(at.place.id).toBe(PLACES[PLACES.length - 1].id)
    expect(at.next.id).toBe(PLACES[PLACES.length - 1].id)
  })

  it('clamps in front of the start, where a rubber-band scroll puts the camera', () => {
    expect(locate(12).place.id).toBe('arrival')
  })
})

describe('placeById', () => {
  it('finds a known place and returns undefined for anything else', () => {
    expect(placeById('department')?.depth).toBe(2)
    expect(placeById('nowhere')).toBeUndefined()
  })
})

describe('BUDGET', () => {
  it('makes lite strictly cheaper than full on every axis', () => {
    expect(BUDGET.lite.layers).toBeLessThan(BUDGET.full.layers)
    expect(BUDGET.lite.bloom).toBe(false)
    expect(BUDGET.full.bloom).toBe(true)
    expect(BUDGET.lite.dpr[1]).toBeLessThanOrEqual(BUDGET.full.dpr[1])
  })
})
