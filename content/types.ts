import type { Bi } from '@/lib/i18n-core'
import type { ProjectCategoryKey, SkillLevelKey } from './site'

export type Stat = { value: number; suffix?: string; label: Bi }

export type SkillGroup = { title: Bi; items: SkillItem[] }

export type SkillItem = { name: string; level: SkillLevelKey }

export type ExperienceItem = {
  company: string
  logo?: string
  role: Bi
  period: string
  points: Bi[]
}

export type ProjectCategory = ProjectCategoryKey

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
