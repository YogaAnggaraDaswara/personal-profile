import type { SkillGroup } from './types'

// ===== EDIT ME: kelompok skill =====
export const skillGroups: SkillGroup[] = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: ['Java', 'Python', 'Node.js', 'Next.js', 'Spring Boot'],
  },
  {
    title: { id: 'AI & Data', en: 'AI & Data' },
    items: ['LLM Integration', 'RAG', 'OCR', 'Prompt Engineering', 'SQL'],
  },
  {
    title: { id: 'Platform & Tools', en: 'Platforms & Tools' },
    items: ['GCP', 'Docker', 'Git', 'REST API', 'CI/CD'],
  },
]

export const marqueeTech = [
  'Java', 'Python', 'Node.js', 'Next.js', 'GCP', 'Docker',
  'LLM', 'RAG', 'OCR', 'SQL', 'REST API', 'Spring Boot',
]
