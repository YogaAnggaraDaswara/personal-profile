import type * as THREE from 'three'
import { ACCENT, CORRIDOR_LENGTH, locate } from '@/components/world/theme'

/**
 * Moves the camera down the corridor from the page's own scroll position.
 *
 * Plain class, not a hook, for the same reason as TunnelPool: this writes to the
 * camera and the fog every frame, and React's compiler correctly refuses
 * mutation of values it handed out. Keeping the mutation inside an object that
 * owns its own state also makes the easing testable without a renderer.
 *
 * Native scroll is used rather than a hijacked wheel handler so the scrollbar
 * stays real and keyboard paging keeps working. Position is damped rather than
 * assigned, which is what turns a scroll gesture into momentum: the camera keeps
 * closing the gap after the wheel stops and never sits perfectly still.
 */
export class CameraRig {
  private pointerX = 0
  private pointerY = 0
  private lastZ = 0
  /** Camera travel per second, exposed for the bloom flash. */
  speed = 0

  /** Fraction of the page scrolled, 0 to 1. Zero when there is nothing to scroll. */
  static scrollProgress(): number {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    return scrollable > 0 ? window.scrollY / scrollable : 0
  }

  update(
    camera: THREE.Camera,
    fog: THREE.Fog | null,
    scratch: THREE.Color,
    pointer: { x: number; y: number },
    delta: number,
  ) {
    // Clamp delta so a backgrounded tab returning to focus cannot fling the
    // camera the length of the corridor in one frame.
    const dt = Math.min(delta, 1 / 30)

    const targetZ = -CameraRig.scrollProgress() * CORRIDOR_LENGTH

    // Exponential damping is frame-rate independent, unlike a fixed lerp factor.
    const ease = 1 - Math.exp(-4.2 * dt)
    camera.position.z += (targetZ - camera.position.z) * ease

    // Pointer parallax, deliberately small. This replaced the cursor glow; its
    // job is to make the space feel inhabited, not to swing the camera.
    this.pointerX += (pointer.x * 1.6 - this.pointerX) * ease
    this.pointerY += (pointer.y * 0.9 - this.pointerY) * ease
    camera.position.x = this.pointerX
    camera.position.y = this.pointerY
    camera.lookAt(this.pointerX * 0.3, this.pointerY * 0.3, camera.position.z - 12)

    // Measured from actual camera travel, not from scroll input, so momentum
    // after the gesture still counts toward the flash.
    this.speed = Math.abs(camera.position.z - this.lastZ) / Math.max(dt, 1e-4)
    this.lastZ = camera.position.z

    // Fog carries the zone colour, so the whole space changes hue as places pass
    // rather than only the objects standing in them.
    if (fog) {
      const { place, next, blend } = locate(camera.position.z)
      fog.color
        .set(ACCENT[place.accent])
        .lerp(scratch.set(ACCENT[next.accent]), blend)
        .multiplyScalar(0.22)
    }
  }
}
