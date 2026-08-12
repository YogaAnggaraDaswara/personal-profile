import * as THREE from 'three'
import { ACCENT, SPACING, locate, type Motif } from '@/components/world/theme'

/**
 * The corridor the camera punches through, as a plain object graph.
 *
 * Deliberately not a React component. Every frame this moves meshes and writes
 * uniforms, and mutating values that React handed out is exactly what the
 * compiler's immutability rule forbids - correctly, for React state. So the pool
 * owns its own objects, exposes one `group` to mount and one `update` to call,
 * and React never sees the parts being mutated.
 *
 * A fixed number of planes is recycled: once one slips behind the camera it
 * jumps a full pool length down the corridor and is repainted for whatever zone
 * it landed in. Punch-through never stops; draw calls never grow.
 */

const MOTIF_INDEX: Record<Motif, number> = { grid: 0, wireframe: 1, gate: 2 }

/** World units within which a plane starts giving way to the camera. */
const PUNCH_RANGE = 20

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * One shader draws all three motifs, chosen by uMotif. Branching on a uniform is
 * coherent across the whole draw call, so it costs nothing measurable, and it
 * keeps the pool on a single compiled program instead of three.
 */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform int uMotif;
  uniform float uOpacity;
  uniform float uDissolve;
  uniform float uTime;

  varying vec2 vUv;

  // Anti-aliased line every period units.
  float lines(float coord, float period, float thickness) {
    float f = fract(coord / period);
    float d = min(f, 1.0 - f) * period;
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float dist = length(p) * 2.0;
    float ink = 0.0;

    if (uMotif == 0) {
      // Infrastructure: dense grid, nodes pulsing at the crossings.
      ink = max(lines(vUv.x, 0.14, 0.004), lines(vUv.y, 0.14, 0.004)) * 0.4;
      vec2 cell = fract(vUv / 0.14) - 0.5;
      float node = 1.0 - smoothstep(0.03, 0.1, length(cell));
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + vUv.x * 24.0 + vUv.y * 18.0);
      ink = max(ink, node * pulse * 0.7);
    } else if (uMotif == 1) {
      // Architecture: sparse boxes joined by connectors.
      ink = max(lines(vUv.x, 0.25, 0.008), lines(vUv.y, 0.25, 0.008)) * 0.5;
      vec2 cell = abs(fract(vUv / 0.25) - 0.5);
      float box = 1.0 - smoothstep(0.28, 0.3, max(cell.x, cell.y));
      float inner = 1.0 - smoothstep(0.2, 0.22, max(cell.x, cell.y));
      ink = max(ink, box - inner);
    } else {
      // Quality gate: a frame with a bar across it.
      float frame = 1.0 - smoothstep(0.43, 0.46, max(abs(p.x), abs(p.y)));
      float innerFrame = 1.0 - smoothstep(0.39, 0.42, max(abs(p.x), abs(p.y)));
      ink = frame - innerFrame;
      ink = max(ink, (1.0 - smoothstep(0.006, 0.01, abs(p.y))) * step(abs(p.x), 0.4) * 0.8);
    }

    // Vignette, so a plane never shows as a hard rectangle against the fog.
    float edge = 1.0 - smoothstep(0.42, 0.95, dist);

    // Punch-through: the hole opens from the middle outward as the camera closes
    // in, so the plane gives way rather than simply fading.
    float hole = smoothstep(uDissolve - 0.35, uDissolve + 0.15, dist);

    float alpha = ink * edge * hole * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

type Layer = { mesh: THREE.Mesh; material: THREE.ShaderMaterial }

export class TunnelPool {
  readonly group = new THREE.Group()

  private readonly geometry = new THREE.PlaneGeometry(64, 40)
  private readonly layers: Layer[] = []
  private readonly stride: number
  private readonly span: number

  /** Scratch colours, reused every frame so the loop allocates nothing. */
  private readonly colour = new THREE.Color()
  private readonly nextColour = new THREE.Color()

  constructor(private readonly count: number) {
    this.stride = SPACING / 3
    this.span = count * this.stride
  }

  /**
   * Builds the planes. Separate from the constructor, and paired with teardown,
   * because a mount is not necessarily permanent: React runs effect cleanup once
   * on mount in development to surface exactly this class of bug. Disposing in
   * the constructor's shadow left the pool alive but empty - the corridor
   * rendered nothing at all, and no error was raised anywhere.
   */
  build() {
    if (this.layers.length > 0) return

    for (let i = 0; i < this.count; i++) {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(ACCENT.cyan) },
          uMotif: { value: 0 },
          uOpacity: { value: 0 },
          uDissolve: { value: 0 },
          uTime: { value: 0 },
        },
      })
      const mesh = new THREE.Mesh(this.geometry, material)
      mesh.position.z = -i * this.stride
      mesh.frustumCulled = false
      this.group.add(mesh)
      this.layers.push({ mesh, material })
    }
  }

  update(cameraZ: number, delta: number) {
    for (const { mesh, material } of this.layers) {
      // Recycle in both directions - scrolling up has to work too.
      while (mesh.position.z > cameraZ + this.stride * 0.5) mesh.position.z -= this.span
      while (mesh.position.z < cameraZ - this.span) mesh.position.z += this.span

      const ahead = cameraZ - mesh.position.z
      const { place, next, blend } = locate(mesh.position.z)
      this.colour.set(ACCENT[place.accent])
      this.nextColour.set(ACCENT[next.accent])
      this.colour.lerp(this.nextColour, blend)

      const uniforms = material.uniforms
      ;(uniforms.uColor.value as THREE.Color).copy(this.colour)
      uniforms.uMotif.value = MOTIF_INDEX[blend > 0.5 ? next.motif : place.motif]

      /**
       * The hole must open only for the plane the camera is actually reaching.
       * Driving it from `1 - t` made even mid-corridor planes 1.2 dissolved,
       * which punched out everything except a ring the vignette then erased -
       * so the corridor rendered as empty space. Tie it to absolute distance
       * instead: nothing beyond PUNCH_RANGE is holed at all.
       */
      const closeness = Math.min(Math.max(1 - ahead / PUNCH_RANGE, 0), 1)
      uniforms.uDissolve.value = closeness * 2.6
      /**
       * Exponential falloff, not linear. The shader ignores scene fog, so depth
       * has to come from here - and a linear ramp left planes 50 units out as
       * bright as the ones nearby, which read as a lit room rather than a
       * corridor going dark.
       */
      uniforms.uOpacity.value = 0.04 + 0.4 * Math.exp(-ahead / 18)
      uniforms.uTime.value += delta
    }
  }

  /**
   * Releases the planes but leaves the pool reusable - build() can run again.
   * GPU memory is not garbage collected, so skipping this leaks one program per
   * plane on every remount.
   */
  teardown() {
    for (const { material } of this.layers) material.dispose()
    this.group.clear()
    this.layers.length = 0
  }

  /** Final release, including the shared geometry. Call when the pool is done. */
  dispose() {
    this.teardown()
    this.geometry.dispose()
  }

  get size() {
    return this.count
  }
}
