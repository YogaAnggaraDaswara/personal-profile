'use client'
import dynamic from 'next/dynamic'
import { Component, type ReactNode } from 'react'
import { useTier } from '@/lib/webgl/use-tier'
import WorldChrome from './world/WorldChrome'

/**
 * Decides which experience a visitor gets.
 *
 * The DOM page is the default and the fallback, never a downgrade path bolted on
 * afterwards: it renders on the server, it is what crawlers and no-JS visitors
 * receive, and it is what stays on screen while the tier is still being
 * measured. The world is only ever added on top once the device has proved it
 * can carry it.
 */
const WorldCanvas = dynamic(() => import('./world/WorldCanvas'), { ssr: false })

/**
 * A lost WebGL context or a failed chunk must not leave a blank page. Both
 * surface here as a render error, and the boundary falls back to the DOM copy -
 * which is already in the tree, so nothing has to be refetched.
 */
class WorldBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function ExperienceRouter({ children }: { children: ReactNode }) {
  const tier = useTier()

  // null means "still measuring" - show the DOM page rather than a placeholder.
  if (tier === null || tier === 'dom') return <>{children}</>

  return (
    <WorldBoundary fallback={children}>
      <WorldCanvas tier={tier} />
      <WorldChrome />
    </WorldBoundary>
  )
}
