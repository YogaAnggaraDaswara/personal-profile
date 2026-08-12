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
      ink = max(lines(vUv.x, 0.05, 0.0016), lines(vUv.y, 0.05, 0.0016)) * 0.55;
      vec2 cell = fract(vUv / 0.05) - 0.5;
      float node = 1.0 - smoothstep(0.06, 0.16, length(cell));
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + vUv.x * 24.0 + vUv.y * 18.0);
      ink = max(ink, node * pulse);
    } else if (uMotif == 1) {
      // Architecture: sparse boxes joined by connectors.
      ink = max(lines(vUv.x, 0.25, 0.0022), lines(vUv.y, 0.25, 0.0022)) * 0.5;
      vec2 cell = abs(fract(vUv / 0.25) - 0.5);
      float box = 1.0 - smoothstep(0.28, 0.3, max(cell.x, cell.y));
      float inner = 1.0 - smoothstep(0.2, 0.22, max(cell.x, cell.y));
      ink = max(ink, box - inner);
    } else {
      // Quality gate: a frame with a bar across it.
      float frame = 1.0 - smoothstep(0.44, 0.46, max(abs(p.x), abs(p.y)));
      float innerFrame = 1.0 - smoothstep(0.4, 0.42, max(abs(p.x), abs(p.y)));
      ink = frame - innerFrame;
      ink = max(ink, (1.0 - smoothstep(0.006, 0.01, abs(p.y))) * step(abs(p.x), 0.4) * 0.8);
    }

    // Vignette, so a plane never shows as a hard rectangle against the fog.
    float edge = 1.0 - smoothstep(0.72, 1.0, dist);

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

  private readonly geometry = new THREE.PlaneGeometry(90, 60)
  private readonly layers: Layer[] = []
  private readonly stride: number
  private readonly span: number

  /** Scratch colours, reused every frame so the loop allocates nothing. */
  private readonly colour = new THREE.Color()
  private readonly nextColour = new THREE.Color()

  constructor(private readonly count: number) {
    this.stride = SPACING / 2
    this.span = count * this.stride

    for (let i = 0; i < count; i++) {
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
      const t = Math.min(Math.max(ahead / this.span, 0), 1)

      const { place, next, blend } = locate(mesh.position.z)
      this.colour.set(ACCENT[place.accent])
      this.nextColour.set(ACCENT[next.accent])
      this.colour.lerp(this.nextColour, blend)

      const uniforms = material.uniforms
      ;(uniforms.uColor.value as THREE.Color).copy(this.colour)
      uniforms.uMotif.value = MOTIF_INDEX[blend > 0.5 ? next.motif : place.motif]
      // Fade in from the far end, then let the hole take over up close.
      uniforms.uOpacity.value = Math.sin(t * Math.PI) * 0.9 + 0.1
      uniforms.uDissolve.value = (1 - t) * 2.4
      uniforms.uTime.value += delta
    }
  }

  /** GPU memory is not garbage collected; a remount without this leaks. */
  dispose() {
    for (const { material } of this.layers) material.dispose()
    this.geometry.dispose()
    this.group.clear()
    this.layers.length = 0
  }

  get size() {
    return this.count
  }
}
