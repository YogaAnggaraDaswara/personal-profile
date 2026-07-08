'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { pick, type Bi, type Lang } from './i18n-core'

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void; t: (b: Bi) => string }

const LangContext = createContext<LangContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (b) => b.id,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id')

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'id' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: (b) => pick(b, lang) }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
