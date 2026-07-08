import type { SkillGroup } from './types'

// ===== EDIT ME: kelompok skill (sumber: CV yoga-daswara-cv.pdf) =====
export const skillGroups: SkillGroup[] = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: ['.NET Core', 'Golang', 'Python', 'Java', 'TypeScript', 'Flutter', 'React', 'Next.js', 'Angular', 'Node.js', 'Express.js'],
  },
  {
    title: { id: 'Backend & Arsitektur', en: 'Backend & Architecture' },
    items: ['Microservices', 'MSSQL', 'MySQL', 'PostgreSQL', 'NoSQL', 'Kafka', 'Ocelot', 'gRPC', 'REST API', 'GraphQL', 'CI/CD'],
  },
  {
    title: { id: 'Cloud & Infrastruktur', en: 'Cloud & Infrastructure' },
    items: ['GCP', 'AWS', 'Docker', 'Kubernetes', 'VMware', 'Linux Server', 'Terraform', 'Helm'],
  },
  {
    title: { id: 'Observability & Monitoring', en: 'Observability & Monitoring' },
    items: ['Grafana', 'Prometheus', 'Loki', 'Thanos','Mimir', 'Monitoring & Alerting', 'Logging & Tracing', 'SLO & SLA'],
  },
  {
    title: { id: 'AI & Produktivitas', en: 'AI & Productivity' },
    items: ['Google AI Studio', 'MyGPT', 'LM Studio', 'AI-assisted Development', 'AI-assisted Testing', 'AI-assisted Documentation', 'AI-assisted Design'],
  },
  {
    title: { id: 'Metodologi & Tools', en: 'Methodology & Tools' },
    items: ['Agile (Scrum/Kanban)', 'Azure DevOps', 'GitHub', 'Jira', 'Sonarqube', 'Postman', 'Swagger', 'Figma', 'Notion'],
  },
  {
    title: { id: 'Kepemimpinan & Soft Skill', en: 'Leadership & Soft Skills' },
    items: [
      'Leadership & People Management',
      'Strategic Thinking',
      'Communication & Collaboration',
      'Mentoring & Coaching',
      'System Analysis & Architecture Design',
    ],
  },
]

export const marqueeTech = [
  '.NET Core', 'Golang', 'Python', 'Java', 'TypeScript',
  'GCP', 'AWS', 'Docker', 'Kubernetes', 'Kafka',
  'Grafana', 'Prometheus', 'Microservices', 'CI/CD',
]
