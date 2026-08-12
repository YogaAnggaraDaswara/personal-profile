/**
 * Decides whether a visitor gets the 3D world, a stripped-down version of it,
 * or the plain DOM page.
 *
 * The decision is deliberately conservative. A portfolio is read by recruiters
 * on whatever phone they happen to hold, so a device that merely *claims* to
 * support WebGL2 is not trusted until it has also sustained a frame rate.
 */

export type Tier = 'full' | 'lite' | 'dom'

export type CapabilitySignals = {
  webgl2: boolean
  reducedMotion: boolean
  /** navigator.hardwareConcurrency, or 0 when the browser withholds it. */
  cores: number
  /** Measured frames per second, or null when the probe did not run. */
  fps: number | null
  /** Coarse pointer usually means phone or tablet. */
  coarsePointer: boolean
}

/**
 * The whole tier policy in one pure function so it can be tested without a
 * browser. Order matters: the disqualifying conditions come first.
 */
export function decideTier(s: CapabilitySignals): Tier {
  // Respecting the OS setting is not negotiable - a moving camera is exactly
  // what someone with vestibular sensitivity turned this off to avoid.
  if (s.reducedMotion) return 'dom'
  if (!s.webgl2) return 'dom'
  if (s.fps !== null && s.fps < 30) return 'dom'

  // A phone that passed the probe still gets the reduced scene. Sustained load
  // over a whole visit is a different problem from a 500ms burst, and thermal
  // throttling shows up long after any probe would have finished.
  if (s.coarsePointer) return 'lite'
  if (s.cores > 0 && s.cores < 4) return 'lite'
  if (s.fps !== null && s.fps < 50) return 'lite'

  return 'full'
}

/** True when the browser can give us a WebGL2 context at all. */
export function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    // Release it immediately; contexts are a limited resource and the real
    // renderer will want its own.
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Counts frames for `durationMs` and returns the rate.
 *
 * Resolves to null when the page is hidden, because a background tab does not
 * schedule animation frames at all and would otherwise look like a 0fps
 * device. Callers treat null as "unknown", not as "slow".
 */
export function probeFps(durationMs = 500): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== 'function' || document.hidden) {
      resolve(null)
      return
    }

    let frames = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      frames++
      const elapsed = now - start
      if (elapsed >= durationMs) {
        // Guard against a single-frame sample producing a wild number.
        resolve(elapsed > 0 ? Math.round((frames / elapsed) * 1000) : null)
        return
      }
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}

/** Reads every signal from the current browser, then applies the policy. */
export async function measureTier(): Promise<Tier> {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const webgl2 = detectWebGL2()

  // No point spending 500ms measuring a device that is already disqualified.
  if (reducedMotion || !webgl2) {
    return decideTier({ webgl2, reducedMotion, cores: 0, fps: null, coarsePointer: false })
  }

  return decideTier({
    webgl2,
    reducedMotion,
    cores: navigator.hardwareConcurrency ?? 0,
    fps: await probeFps(),
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  })
}
