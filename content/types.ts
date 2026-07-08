import type { Bi } from '@/lib/i18n-core'

export type Stat = { value: number; suffix?: string; label: Bi }

export type SkillGroup = { title: Bi; items: string[] }

export type ExperienceItem = {
  company: string
  role: Bi
  period: string
  points: Bi[]
}

export type ProjectCategory = 'ai' | 'banking' | 'web'

export type Project = {
  slug: string
  title: string
  category: ProjectCategory
  summary: Bi
  problem: Bi
  solution: Bi
  architecture: Bi
  tech: string[]
  impact: Bi
}

export type AiUseCase = { title: Bi; description: Bi; tech: string[] }
