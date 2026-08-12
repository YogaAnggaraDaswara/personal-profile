import type { Bi } from '@/lib/i18n-core'

export type Stat = { value: number; suffix?: string; label: Bi }

export type SkillGroup = { title: Bi; items: SkillItem[] }

export type SkillItem = { name: string; level: 'expert' | 'advanced' | 'intermediate' }

export type ExperienceItem = {
  company: string
  logo?: string
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

/** Which visual identity an org unit gets in the Organization section. */
export type OrgAccent = 'cyan' | 'violet' | 'emerald'

export type OrgUnit = {
  /** Stable id, also used as the React key and the motif pattern id. */
  key: string
  name: Bi
  accent: OrgAccent
  /**
   * Number of people in the unit. Headcount only, never names - the site is
   * public, and staff names are internal data. Set to 0 to hide the number.
   */
  headcount: number
  /** Short line describing what the unit owns. */
  focus: Bi
  /** What the unit is accountable for, 2-4 items reads best. */
  scope: Bi[]
}
