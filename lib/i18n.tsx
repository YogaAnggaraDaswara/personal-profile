'use client'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { pick, type Bi, type Lang } from './i18n-core'

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void; t: (b: Bi) => string }

const LangContext = createContext<LangContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (b) => b.id,
})

const STORAGE_KEY = 'lang'
const DEFAULT_LANG: Lang = 'id'

/**
 * The saved language lives in localStorage, which React cannot see during
 * render. Wrapping it in a tiny external store lets the provider read the
 * real value on the first client render instead of rendering the default and
 * then correcting it in an effect.
 */
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  // Keep tabs in sync when the language is changed elsewhere.
  window.addEventListener('storage', onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getSnapshot(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'id' || saved === 'en' ? saved : DEFAULT_LANG
}

const getServerSnapshot = (): Lang => DEFAULT_LANG

function writeLang(l: Lang) {
  localStorage.setItem(STORAGE_KEY, l)
  emit()
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const setLang = useCallback((l: Lang) => writeLang(l), [])

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (b) => pick(b, lang) }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
