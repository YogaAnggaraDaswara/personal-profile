import type { SkillGroup } from './types'

// ===== EDIT ME: kelompok skill (sumber: CV yoga-daswara-cv.pdf) =====
// level: 'expert' (5+ tahun daily use), 'advanced' (3+ tahun), 'intermediate' (1-3 tahun)
export const skillGroups: SkillGroup[] = [
  {
    title: { id: 'Bahasa & Framework', en: 'Languages & Frameworks' },
    items: [
      { name: '.NET Core', level: 'expert' },
      { name: 'Golang', level: 'advanced' },
      { name: 'Python', level: 'advanced' },
      { name: 'Java', level: 'intermediate' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Flutter', level: 'intermediate' },
      { name: 'React', level: 'advanced' },
      { name: 'Next.js', level: 'advanced' },
      { name: 'Angular', level: 'intermediate' },
      { name: 'Node.js', level: 'advanced' },
      { name: 'Express.js', level: 'advanced' },
    ],
  },
  {
    title: { id: 'Backend & Arsitektur', en: 'Backend & Architecture' },
    items: [
      { name: 'Microservices', level: 'expert' },
      { name: 'MSSQL', level: 'expert' },
      { name: 'MySQL', level: 'advanced' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'NoSQL', level: 'advanced' },
      { name: 'Kafka', level: 'advanced' },
      { name: 'Ocelot', level: 'expert' },
      { name: 'gRPC', level: 'intermediate' },
      { name: 'REST API', level: 'expert' },
      { name: 'GraphQL', level: 'intermediate' },
      { name: 'CI/CD', level: 'expert' },
    ],
  },
  {
    title: { id: 'Cloud & Infrastruktur', en: 'Cloud & Infrastructure' },
    items: [
      { name: 'GCP', level: 'advanced' },
      { name: 'AWS', level: 'advanced' },
      { name: 'Docker', level: 'expert' },
      { name: 'Kubernetes', level: 'advanced' },
      { name: 'VMware', level: 'intermediate' },
      { name: 'Linux Server', level: 'expert' },
      { name: 'Terraform', level: 'intermediate' },
      { name: 'Helm', level: 'advanced' },
    ],
  },
  {
    title: { id: 'Observability & Monitoring', en: 'Observability & Monitoring' },
    items: [
      { name: 'Grafana', level: 'expert' },
      { name: 'Prometheus', level: 'expert' },
      { name: 'Loki', level: 'advanced' },
      { name: 'Thanos', level: 'advanced' },
      { name: 'Mimir', level: 'intermediate' },
      { name: 'Monitoring & Alerting', level: 'expert' },
      { name: 'Logging & Tracing', level: 'expert' },
      { name: 'SLO & SLA', level: 'expert' },
    ],
  },
  {
    title: { id: 'AI & Produktivitas', en: 'AI & Productivity' },
    items: [
      { name: 'Google AI Studio', level: 'advanced' },
      { name: 'MyGPT', level: 'advanced' },
      { name: 'LM Studio', level: 'intermediate' },
      { name: 'AI-assisted Development', level: 'advanced' },
      { name: 'AI-assisted Testing', level: 'advanced' },
      { name: 'AI-assisted Documentation', level: 'advanced' },
      { name: 'AI-assisted Design', level: 'intermediate' },
    ],
  },
  {
    title: { id: 'Metodologi & Tools', en: 'Methodology & Tools' },
    items: [
      { name: 'Agile (Scrum/Kanban)', level: 'expert' },
      { name: 'Azure DevOps', level: 'advanced' },
      { name: 'GitHub', level: 'expert' },
      { name: 'Jira', level: 'advanced' },
      { name: 'Sonarqube', level: 'advanced' },
      { name: 'Postman', level: 'expert' },
      { name: 'Swagger', level: 'expert' },
      { name: 'Figma', level: 'intermediate' },
      { name: 'Notion', level: 'advanced' },
    ],
  },
  {
    title: { id: 'Kepemimpinan & Soft Skill', en: 'Leadership & Soft Skills' },
    items: [
      { name: 'Leadership & People Management', level: 'expert' },
      { name: 'Strategic Thinking', level: 'expert' },
      { name: 'Communication & Collaboration', level: 'expert' },
      { name: 'Mentoring & Coaching', level: 'advanced' },
      { name: 'System Analysis & Architecture Design', level: 'expert' },
    ],
  },
]

export const marqueeTech = [
  '.NET Core', 'Golang', 'Python', 'Java', 'TypeScript',
  'GCP', 'AWS', 'Docker', 'Kubernetes', 'Kafka',
  'Grafana', 'Prometheus', 'Microservices', 'CI/CD',
]
