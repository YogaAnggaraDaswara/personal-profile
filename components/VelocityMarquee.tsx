'use client'
import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

/**
 * Wraps `value` into the [min, max) range.
 *
 * framer-motion ships a `wrap` helper, but its export path has moved
 * between versions. Four lines inlined here is cheaper than a build
 * failure on an import that may not resolve.
 */
function wrap(min: number, max: number, value: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

type Props = {
  items: string[]
  /** Idle drift in % of track width per second. */
  baseVelocity?: number
  className?: string
}

/**
 * Continuously scrolling text that reacts to page scroll:
 *
 * - scrolling down speeds it up, scrolling up reverses its direction
 * - scroll velocity skews the text, so it appears to lag under motion
 * - it keeps drifting when the page is still, so it never looks frozen
 *
 * Only `transform` is animated, so it stays on the compositor and does
 * not trigger layout or paint.
 */
export default function VelocityMarquee({ items, baseVelocity = 2, className }: Props) {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Generous margin so it is already moving before it scrolls into view.
  const inView = useInView(containerRef, { margin: '200px' })

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  // Raw scroll velocity is spiky. Spring it so the reaction reads as
  // momentum instead of jitter.
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })

  // clamp:false lets fast scrolling push past the top of the range.
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  // Skew stays clamped so violent scrolling cannot shear the text apart.
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], [-8, 0, 8], { clamp: true })

  const directionFactor = useRef(1)

  // Four copies of the list are rendered, so wrapping over 25% of the
  // track lands exactly one full set further along: a seamless loop.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  // Called unconditionally to keep hook order stable; the bail-out lives
  // inside the callback instead of skipping the hook.
  //
  // Gating on `inView` matters: without it this writes a motion value on
  // every frame for the whole life of the page, forcing a style recalc
  // and composite even while the marquee is nowhere near the screen.
  useAnimationFrame((_t, delta) => {
    if (reduce || !inView) return

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    const factor = velocityFactor.get()
    if (factor < 0) directionFactor.current = -1
    else if (factor > 0) directionFactor.current = 1

    moveBy += directionFactor.current * moveBy * Math.abs(factor)
    baseX.set(baseX.get() + moveBy)
  })

  const itemClass =
    'text-2xl font-extrabold whitespace-nowrap text-white/10 md:text-4xl'

  if (reduce) {
    return (
      <div className={`overflow-hidden ${className ?? ''}`}>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item) => (
            <span key={item} className={itemClass}>
              {item}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] ${className ?? ''}`}
    >
      <motion.div style={{ skewX }}>
        <motion.div className="flex w-max gap-8 md:gap-12" style={{ x }}>
          {/* Four passes: one visible set plus enough lead-in that the
              wrap point is never on screen. */}
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <span key={`${item}-${i}`} className={itemClass}>
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
