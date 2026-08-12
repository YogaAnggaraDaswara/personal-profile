'use client'
import ContactGate from '@/components/ContactGate'
import { ACCENT } from '../theme'
import Panel from '../Panel'

/**
 * The last place: a gate frame with the real contact form standing in it.
 *
 * The form is the existing ContactGate component, unchanged - validation, rate
 * limiting, Turnstile, and the API contract all still apply. Rebuilding a form
 * in 3D would mean rebuilding its accessibility too, and there is nothing to
 * gain from that.
 */
export default function Gate() {

  return (
    <group>
      {/* Concentric gate rings, receding, to mark the end of the corridor. */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0, -6 - i * 3.2]}>
          <torusGeometry args={[7.4 - i * 0.9, 0.06, 8, 48]} />
          <meshBasicMaterial color={ACCENT.emerald} transparent opacity={0.5 - i * 0.13} />
        </mesh>
      ))}

      <Panel position={[0, 0, -1]} width={440} className="world-panel-wide">
        <ContactGate />
      </Panel>
    </group>
  )
}
