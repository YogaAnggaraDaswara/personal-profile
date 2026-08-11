/**
 * Custom analytics event tracking utility.
 * Uses Vercel Analytics custom events when available.
 * Falls back to console.log in development.
 */

type AnalyticsEvent =
  | { name: 'cv_download'; properties: { source: string } }
  | { name: 'contact_submit'; properties: { purpose: string } }
  | { name: 'project_click'; properties: { slug: string; title: string } }
  | { name: 'project_detail_view'; properties: { slug: string } }
  | { name: 'section_view'; properties: { section: string } }
  | { name: 'language_switch'; properties: { from: string; to: string } }
  | { name: 'social_click'; properties: { platform: string } }
  | { name: 'certification_click'; properties: { title: string } }

export function trackEvent(event: AnalyticsEvent): void {
  try {
    // Vercel Analytics track function (injected by @vercel/analytics)
    if (typeof window !== 'undefined' && 'va' in window) {
      const va = (window as unknown as { va: (cmd: string, opts: Record<string, unknown>) => void }).va
      va('event', { name: event.name, ...event.properties })
      return
    }

    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics]', event.name, event.properties)
    }
  } catch {
    // Silently fail - analytics should never break the app
  }
}
