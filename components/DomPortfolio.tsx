import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ScrollProgress from '@/components/ScrollProgress'
import SkipToContent from '@/components/SkipToContent'

// Lazy-load below-fold components - won't block initial page render
const About = dynamic(() => import('@/components/About'))
const OrgStructure = dynamic(() => import('@/components/OrgStructure'))
const Skills = dynamic(() => import('@/components/Skills'))
const Experience = dynamic(() => import('@/components/Experience'))
const Projects = dynamic(() => import('@/components/Projects'))
const AiUseCases = dynamic(() => import('@/components/AiUseCases'))
const ContactGate = dynamic(() => import('@/components/ContactGate'))
const ScrollTopButton = dynamic(() => import('@/components/ScrollTopButton'))

/**
 * The flat, readable portfolio.
 *
 * This is not a fallback that was added later - it is the canonical content.
 * It server-renders on `/`, so crawlers and no-JS visitors get the full text,
 * and it is what stays on screen when the 3D world is unavailable, declined by
 * prefers-reduced-motion, or reached via the /text route.
 *
 * The Intro splash and the cursor glow deliberately do not appear here; both
 * were absorbed into the world, and neither adds anything to a document meant
 * to be read quickly.
 */
export default function DomPortfolio() {
  return (
    <main id="main-content" aria-label="Portfolio content">
      <SkipToContent />
      <ScrollProgress />
      <Navbar />
      <section id="top" aria-hidden="true" />
      <section id="hero" aria-label="Hero introduction">
        <Hero />
      </section>
      <section id="about" className="section-shell" aria-labelledby="about-heading">
        <About />
      </section>
      {/* Inserting the org section shifts the light/dark alternation of every
          section below it, hence the flipped section-alt classes. */}
      <section id="org" className="section-shell section-alt" aria-labelledby="org-heading">
        <OrgStructure />
      </section>
      <section id="skills" className="section-shell" aria-labelledby="skills-heading">
        <Skills />
      </section>
      <section id="experience" className="section-shell section-alt" aria-labelledby="experience-heading">
        <Experience />
      </section>
      <section id="projects" className="section-shell" aria-labelledby="projects-heading">
        <Projects />
      </section>
      <section id="ai" className="section-shell section-alt" aria-labelledby="ai-heading">
        <AiUseCases />
      </section>
      <section id="contact" className="section-shell" aria-labelledby="contact-heading">
        <ContactGate />
      </section>
      <Footer />
      <ScrollTopButton />
    </main>
  )
}
