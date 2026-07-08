'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function Intro() {
  const [show, setShow] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      setShow(false)
      return
    }
    const timer = setTimeout(() => setShow(false), 1400)
    return () => clearTimeout(timer)
  }, [reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)]"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="grad-text text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            YAD
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
