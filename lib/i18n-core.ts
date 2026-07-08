export type Lang = 'id' | 'en'
export type Bi = { id: string; en: string }

export function pick(b: Bi, lang: Lang): string {
  return b[lang] || b.id
}
