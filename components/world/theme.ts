import type { Tier } from '@/lib/webgl/capability'

/**
 * Where each place sits in the corridor and what it looks like.
 *
 * The world is one continuous space along -Z. `depth` is the place's index, and
 * the rig multiplies it by SPACING to get world coordinates - keeping the two
 * apart means the corridor can be stretched or compressed in one number without
 * touching any zone.
 */

/**
 * World units between one place and the next. Wide enough that a place has left
 * the frustum before the next one enters it - at 26 with a 62 degree camera,
 * three places were on screen at once and the corridor read as a pile.
 */
export const SPACING = 38

/**
 * How far ahead of its scroll anchor a place's content sits.
 *
 * The camera settles exactly on the anchor, so content placed at the anchor ends
 * up inside the camera and never appears. This offset is what the zones' lateral
 * positions are framed against: at 16 units with a 62 degree camera, roughly 9
 * units either side of centre is on screen.
 */
export const VIEW_DISTANCE = 16

/** Mirrors --cyan / --violet / --emerald in globals.css. */
export const ACCENT = {
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  emerald: '#34d399',
} as const

export type AccentName = keyof typeof ACCENT

/** The pattern a recycled tunnel plane wears inside a given zone. */
export type Motif = 'grid' | 'wireframe' | 'gate'

export type Place = {
  id: string
  /** Index along the corridor, 0 is the arrival point. */
  depth: number
  accent: AccentName
  motif: Motif
  /** Matches the DOM route's section id so the nav can target both. */
  domId: string
}

export const PLACES: Place[] = [
  { id: 'arrival', depth: 0, accent: 'cyan', motif: 'grid', domId: 'hero' },
  { id: 'about', depth: 1, accent: 'cyan', motif: 'grid', domId: 'about' },
  { id: 'department', depth: 2, accent: 'violet', motif: 'wireframe', domId: 'org' },
  { id: 'skills', depth: 3, accent: 'violet', motif: 'wireframe', domId: 'skills' },
  { id: 'experience', depth: 4, accent: 'violet', motif: 'wireframe', domId: 'experience' },
  { id: 'projects', depth: 5, accent: 'emerald', motif: 'gate', domId: 'projects' },
  { id: 'ai', depth: 6, accent: 'emerald', motif: 'gate', domId: 'ai' },
  { id: 'gate', depth: 7, accent: 'emerald', motif: 'gate', domId: 'contact' },
]

/** Total scrollable depth, in world units. */
export const CORRIDOR_LENGTH = (PLACES.length - 1) * SPACING

/**
 * How many viewport heights of scrollbar the corridor needs. Lives here rather
 * than in WorldCanvas so the router can size the page without pulling the whole
 * three.js chunk into the initial bundle.
 */
export const WORLD_SCREENS = PLACES.length

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id)
}

/**
 * Which place a camera at `z` is closest to, and how far it has travelled past
 * it. `blend` runs 0 to 1 across the gap to the next place, which is what the
 * fog and tunnel colours interpolate on.
 */
export function locate(z: number): { place: Place; next: Place; blend: number } {
  const travelled = Math.min(Math.max(-z, 0), CORRIDOR_LENGTH)
  const raw = travelled / SPACING
  const index = Math.min(Math.floor(raw), PLACES.length - 1)
  const nextIndex = Math.min(index + 1, PLACES.length - 1)
  return { place: PLACES[index], next: PLACES[nextIndex], blend: raw - index }
}

/** Per-tier scene budget. Everything expensive is expressed here, once. */
export const BUDGET: Record<Exclude<Tier, 'dom'>, { layers: number; bloom: boolean; dpr: [number, number] }> = {
  full: { layers: 12, bloom: true, dpr: [1, 2] },
  lite: { layers: 6, bloom: false, dpr: [1, 1] },
}
