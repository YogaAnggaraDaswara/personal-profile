import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { projects } from '@/content/projects'
import ProjectDetailClient from './ProjectDetailClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} | Yoga Daswara`,
    description: project.summary.en,
    openGraph: {
      title: project.title,
      description: project.summary.en,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return notFound()

  const idx = projects.indexOf(project)
  const prev = idx > 0 ? projects[idx - 1] ?? null : null
  const next = idx < projects.length - 1 ? projects[idx + 1] ?? null : null

  return <ProjectDetailClient project={project} prev={prev} next={next} />
}
