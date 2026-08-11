import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import ScrollProgress from '@/components/ScrollProgress'
import SkipToContent from '@/components/SkipToContent'

// Lazy-load below-fold components - these won't block initial page render
const About = dynamic(() => import('@/components/About'))
const Skills = dynamic(() => import('@/components/Skills'))
const Experience = dynamic(() => import('@/components/Experience'))
const Projects = dynamic(() => import('@/components/Projects'))
const AiUseCases = dynamic(() => import('@/components/AiUseCases'))
const ContactGate = dynamic(() => import('@/components/ContactGate'))
const ScrollTopButton = dynamic(() => import('@/components/ScrollTopButton'))

// CursorGlow is desktop-only and non-essential, lazy-load with no SSR
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), { ssr: false })

export default function Home() {
  return (
    <main id="main-content" aria-label="Portfolio content">
      <SkipToContent />
      <Intro />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <section id="top" aria-hidden="true" />
      <section id="hero" aria-label="Hero introduction">
        <Hero />
      </section>
      <section id="about" className="section-shell" aria-labelledby="about-heading">
        <About />
      </section>
      <section id="skills" className="section-shell section-alt" aria-labelledby="skills-heading">
        <Skills />
      </section>
      <section id="experience" className="section-shell" aria-labelledby="experience-heading">
        <Experience />
      </section>
      <section id="projects" className="section-shell section-alt" aria-labelledby="projects-heading">
        <Projects />
      </section>
      <section id="ai" className="section-shell" aria-labelledby="ai-heading">
        <AiUseCases />
      </section>
      <section id="contact" className="section-shell section-alt" aria-labelledby="contact-heading">
        <ContactGate />
      </section>
      <Footer />
      <ScrollTopButton />
    </main>
  )
}
