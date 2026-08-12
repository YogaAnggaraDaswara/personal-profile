'use client'
import type { OrgAccent } from '@/content/types'

/**
 * The background motif behind each org unit card. Each discipline gets its
 * own geometry rather than the same generic dot grid, so the three units are
 * distinguishable at a glance even before reading the labels:
 *
 * - system-engineer      isometric grid + nodes  -> infrastructure
 * - solution-architecture blueprint bezier curves -> design and connection
 * - quality-assurance     stacked check marks     -> verification
 *
 * Pure SVG with no animation of its own; the parent handles motion. Pattern
 * ids are namespaced by `id` because several of these render on one page and
 * duplicate SVG ids would cross-reference each other.
 */
export default function OrgMotif({ id, accent }: { id: string; accent: OrgAccent }) {
  const stroke = `var(--${accent})`
  const patternId = `org-motif-${id}`

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={patternId} width="56" height="56" patternUnits="userSpaceOnUse">
          {accent === 'cyan' && (
            <g stroke={stroke} strokeWidth="1" fill="none">
              <path d="M0 28 L28 14 L56 28 L28 42 Z" />
              <path d="M28 42 L28 56 M28 0 L28 14" />
              <circle cx="28" cy="14" r="2.5" fill={stroke} stroke="none" />
              <circle cx="0" cy="28" r="1.8" fill={stroke} stroke="none" />
              <circle cx="56" cy="28" r="1.8" fill={stroke} stroke="none" />
            </g>
          )}
          {accent === 'violet' && (
            <g stroke={stroke} strokeWidth="1" fill="none">
              <path d="M0 44 C 14 44, 14 12, 28 12 S 42 44, 56 44" />
              <path d="M0 12 L8 12 M48 44 L56 44" strokeDasharray="3 3" />
              <rect x="24" y="8" width="8" height="8" />
              <rect x="4" y="40" width="6" height="6" />
            </g>
          )}
          {accent === 'emerald' && (
            <g stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round">
              <path d="M8 28 L16 36 L32 16" />
              <path d="M30 48 L36 54 L50 38" opacity="0.55" />
              <path d="M0 6 L56 6" strokeWidth="0.6" strokeDasharray="2 6" />
            </g>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
