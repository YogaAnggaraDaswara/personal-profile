'use client'
import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useFinePointer } from '@/lib/use-fine-pointer'

export default function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const finePointer = useFinePointer()
  const [pos, setPos] = useState({ x: 0, y: 0 })

  // Touch devices never fire mousemove, so the spring would just sit
  // idle. Render a plain wrapper instead of a motion component.
  if (reduce || !finePointer) return <div className={className}>{children}</div>

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
