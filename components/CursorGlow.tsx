'use client'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useFinePointer } from '@/lib/use-fine-pointer'

export default function CursorGlow() {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const enabled = !reduce && fine
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    if (!enabled) return
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [enabled])

  if (!enabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] h-8 w-8 rounded-full mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, rgba(124,58,237,0.7), rgba(34,211,238,0.3) 60%, transparent 70%)',
      }}
      animate={{ x: pos.x - 16, y: pos.y - 16 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.3 }}
    />
  )
}
