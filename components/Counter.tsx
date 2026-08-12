'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export default function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  // With reduced motion there is no tween to read from, so jump straight to
  // the target once the counter scrolls into view.
  const shown = reduce ? (inView ? to : 0) : n

  return (
    <span ref={ref} className="grad-text text-4xl font-extrabold md:text-5xl">
      {shown}
      {suffix}
    </span>
  )
}
