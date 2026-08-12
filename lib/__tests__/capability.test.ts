import { describe, it, expect } from 'vitest'
import { decideTier, type CapabilitySignals } from '@/lib/webgl/capability'

/** A device that qualifies for everything; each test bends one signal. */
const strong: CapabilitySignals = {
  webgl2: true,
  reducedMotion: false,
  cores: 8,
  fps: 60,
  coarsePointer: false,
}

describe('decideTier', () => {
  it('gives a strong desktop the full world', () => {
    expect(decideTier(strong)).toBe('full')
  })

  it('sends reduced-motion visitors to the DOM page even on strong hardware', () => {
    expect(decideTier({ ...strong, reducedMotion: true })).toBe('dom')
  })

  it('sends a browser without WebGL2 to the DOM page', () => {
    expect(decideTier({ ...strong, webgl2: false })).toBe('dom')
  })

  it('sends a device that cannot hold 30fps to the DOM page', () => {
    expect(decideTier({ ...strong, fps: 22 })).toBe('dom')
  })

  it('gives a coarse pointer the reduced scene even at 60fps', () => {
    expect(decideTier({ ...strong, coarsePointer: true })).toBe('lite')
  })

  it('gives a low-core device the reduced scene', () => {
    expect(decideTier({ ...strong, cores: 2 })).toBe('lite')
  })

  it('gives a mid-range frame rate the reduced scene', () => {
    expect(decideTier({ ...strong, fps: 42 })).toBe('lite')
  })

  it('treats an unknown frame rate as acceptable rather than slow', () => {
    expect(decideTier({ ...strong, fps: null })).toBe('full')
  })

  it('treats an unreported core count as acceptable rather than slow', () => {
    expect(decideTier({ ...strong, cores: 0 })).toBe('full')
  })

  it('prefers the DOM page when a weak device also asks for reduced motion', () => {
    expect(decideTier({ ...strong, cores: 2, reducedMotion: true })).toBe('dom')
  })
})
