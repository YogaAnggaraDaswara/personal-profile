import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CameraRig } from '@/lib/webgl/camera-rig'
import { CORRIDOR_LENGTH } from '@/components/world/theme'

/**
 * The rig is tested without a renderer: it only ever reads a scroll position and
 * writes to a camera-shaped object, so a stub with a position vector is enough.
 * That is the reason the maths lives outside the React component.
 */
type Stub = {
  position: { x: number; y: number; z: number }
  lookAt: (x: number, y: number, z: number) => void
}

function camera(): Stub {
  return { position: { x: 0, y: 0, z: 0 }, lookAt: () => {} }
}

const centre = { x: 0, y: 0 }

/** Stands in for THREE.Color; the rig only calls set() on the scratch value. */
const scratch = { set: () => scratch } as never

/**
 * The suite runs in the `node` environment, so the two browser globals the rig
 * reads are stubbed rather than emulating a whole DOM. It touches exactly three
 * properties, which is the point of keeping the scroll read in one static method.
 */
function setScroll(progress: number, pageHeight = 8000, viewport = 1000) {
  const g = globalThis as unknown as {
    document: { documentElement: { scrollHeight: number } }
    window: { innerHeight: number; scrollY: number }
  }
  g.document = { documentElement: { scrollHeight: pageHeight } }
  g.window = { innerHeight: viewport, scrollY: progress * (pageHeight - viewport) }
}

describe('CameraRig.scrollProgress', () => {
  afterEach(() => setScroll(0))

  it('reports zero at the top', () => {
    setScroll(0)
    expect(CameraRig.scrollProgress()).toBe(0)
  })

  it('reports one at the bottom', () => {
    setScroll(1)
    expect(CameraRig.scrollProgress()).toBeCloseTo(1)
  })

  it('reports zero when the page is shorter than the viewport', () => {
    setScroll(0, 600, 1000)
    expect(CameraRig.scrollProgress()).toBe(0)
  })
})

describe('CameraRig.update', () => {
  let rig: CameraRig
  let cam: Stub

  beforeEach(() => {
    rig = new CameraRig()
    cam = camera()
  })

  it('moves the camera toward the far end as the page scrolls', () => {
    setScroll(1)
    for (let i = 0; i < 300; i++) rig.update(cam as never, null, scratch, centre, 1 / 60)
    expect(cam.position.z).toBeCloseTo(-CORRIDOR_LENGTH, 1)
  })

  it('damps rather than jumps, so a single frame never arrives', () => {
    setScroll(1)
    rig.update(cam as never, null, scratch, centre, 1 / 60)
    expect(cam.position.z).toBeLessThan(0)
    expect(cam.position.z).toBeGreaterThan(-CORRIDOR_LENGTH)
  })

  it('reaches the same place regardless of frame rate', () => {
    setScroll(0.5)
    const slow = camera()
    const fast = camera()
    const slowRig = new CameraRig()
    const fastRig = new CameraRig()
    // One second of travel, sampled at 30fps and at 120fps.
    for (let i = 0; i < 30; i++) slowRig.update(slow as never, null, scratch, centre, 1 / 30)
    for (let i = 0; i < 120; i++) fastRig.update(fast as never, null, scratch, centre, 1 / 120)
    expect(slow.position.z).toBeCloseTo(fast.position.z, 1)
  })

  it('clamps a huge delta so a backgrounded tab cannot fling the camera', () => {
    setScroll(1)
    const jumped = camera()
    const stepped = camera()
    new CameraRig().update(jumped as never, null, scratch, centre, 30)
    new CameraRig().update(stepped as never, null, scratch, centre, 1 / 30)
    // A 30 second delta must behave exactly like the 1/30s clamp ceiling.
    expect(jumped.position.z).toBeCloseTo(stepped.position.z, 6)
  })

  it('reports speed while travelling and settles toward zero on arrival', () => {
    setScroll(1)
    rig.update(cam as never, null, scratch, centre, 1 / 60)
    const moving = rig.speed
    expect(moving).toBeGreaterThan(0)
    for (let i = 0; i < 600; i++) rig.update(cam as never, null, scratch, centre, 1 / 60)
    expect(rig.speed).toBeLessThan(moving)
  })

  it('offsets the camera toward the pointer without leaving the corridor', () => {
    setScroll(0)
    for (let i = 0; i < 120; i++) {
      rig.update(cam as never, null, scratch, { x: 1, y: 1 }, 1 / 60)
    }
    expect(cam.position.x).toBeCloseTo(1.6, 1)
    expect(cam.position.y).toBeCloseTo(0.9, 1)
  })
})
