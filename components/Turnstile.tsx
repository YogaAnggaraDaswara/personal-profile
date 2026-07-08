'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve) => {
    if (window.turnstile) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
  return scriptPromise
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !ref.current) return
    let widgetId: string | undefined
    let cancelled = false

    loadScript().then(() => {
      if (cancelled || !window.turnstile || !ref.current) return
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    })

    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  if (!siteKey) return null

  return <div ref={ref} className="mt-2" />
}
