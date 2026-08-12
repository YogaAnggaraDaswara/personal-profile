import type { Metadata } from 'next'
import DomPortfolio from '@/components/DomPortfolio'

export const metadata: Metadata = {
  title: 'Yoga Daswara | Text version',
  description:
    'Plain, fully readable version of the portfolio - no 3D, no WebGL, no motion.',
  // The content is identical to the home page, so point search engines at the
  // canonical one instead of competing with it.
  alternates: { canonical: '/' },
  robots: { index: false, follow: true },
}

/**
 * A permanent text route, not a redirect.
 *
 * Someone who reaches the world and wants to read instead - or who uses a screen
 * reader, or is on a metered connection - needs a stable URL they can bookmark
 * and share. This is it, and the world's chrome links to it directly.
 */
export default function TextPage() {
  return <DomPortfolio />
}
