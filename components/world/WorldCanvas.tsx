'use client'
import { Suspense, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { BloomEffect } from 'postprocessing'
import type { Tier } from '@/lib/webgl/capability'
import { BUDGET, placeById } from './theme'
import Rig from './Rig'
import Tunnel from './Tunnel'
import Arrival from './zones/Arrival'
import About from './zones/About'
import Department from './zones/Department'
import Skills from './zones/Skills'
import Experience from './zones/Experience'
import Projects from './zones/Projects'
import AiUseCases from './zones/AiUseCases'
import Gate from './zones/Gate'

/** Places, in corridor order, paired with what renders at each. */
const ZONES = [
  { id: 'arrival', Component: Arrival },
  { id: 'about', Component: About },
  { id: 'department', Component: Department },
  { id: 'skills', Component: Skills },
  { id: 'experience', Component: Experience },
  { id: 'projects', Component: Projects },
  { id: 'ai', Component: AiUseCases },
  { id: 'gate', Component: Gate },
] as const

function Scene({ tier }: { tier: Exclude<Tier, 'dom'> }) {
  const budget = BUDGET[tier]
  const bloom = useRef<BloomEffect>(null)

  /**
   * Scroll speed reaches the bloom pass by mutating the effect directly rather
   * than through React state. At 60fps a setState per frame would re-render the
   * whole scene tree sixty times a second to change one float.
   */
  const flash = useCallback((v: number) => {
    if (bloom.current) bloom.current.intensity = 0.55 + v * 1.9
  }, [])

  return (
    <>
      <Rig bloomFlash={budget.bloom ? flash : undefined} />
      {/* Keyed by layer count: the pool is built once per mount, so a tier change
          has to produce a fresh component rather than mutate the old pool. */}
      <Tunnel key={budget.layers} layers={budget.layers} />

      {ZONES.map(({ id, Component }) => {
        const place = placeById(id)
        if (!place) return null
        return <Component key={id} depth={place.depth} />
      })}

      {budget.bloom && (
        <EffectComposer>
          {/* Threshold well above the fog so only the bright motif lines and the
              punch-through flash bloom, not the whole frame. */}
          <Bloom ref={bloom} intensity={0.55} luminanceThreshold={0.32} mipmapBlur />
        </EffectComposer>
      )}
    </>
  )
}

export default function WorldCanvas({ tier }: { tier: Exclude<Tier, 'dom'> }) {
  return (
    /* This container is the world's main landmark. drei renders the content
       panels into it, so they belong inside <main>; an empty canvas carries no
       semantics of its own and needs no hiding. Marking the container
       presentational instead would have stripped the only content on screen out
       of the accessibility tree. */
    <main className="world-canvas" id="main-content" aria-label="Portfolio world">
      <Canvas
        dpr={BUDGET[tier].dpr}
        camera={{ position: [0, 0, 6], fov: 62, near: 0.1, far: 200 }}
        // The canvas is a fixed backdrop; the page below it owns scrolling, so
        // the canvas must never swallow wheel or touch events.
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: tier === 'full', powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene tier={tier} />
        </Suspense>
      </Canvas>
    </main>
  )
}
