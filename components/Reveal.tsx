'use client'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      /* A spring settles with a little overshoot, which reads as
         physical. The previous fixed-duration easeOut felt mechanical
         because every element moved at an identical rate.

         Deliberately 2D: adding rotateX and a perspective would give
         more depth, but it also promotes every one of the ~30 Reveal
         wrappers on the page to its own composited 3D layer, which
         costs memory on phones. Not worth it for a one-shot entrance. */
      transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}
