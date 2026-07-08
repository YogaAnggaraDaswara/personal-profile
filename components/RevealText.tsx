'use client'
import { motion, useReducedMotion } from 'framer-motion'

export default function RevealText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion()

  if (reduce) return <span className={className}>{text}</span>

  const letters = Array.from(text)

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.35, delay: i * 0.02 }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </motion.span>
  )
}
