'use client'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-2 left-2 z-[300] -translate-y-20 rounded-lg bg-[var(--violet)] px-4 py-2 text-sm font-bold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
    >
      Skip to main content
    </a>
  )
}
