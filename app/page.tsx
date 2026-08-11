import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import AiUseCases from '@/components/AiUseCases'
import ContactGate from '@/components/ContactGate'
import Intro from '@/components/Intro'
import ScrollProgress from '@/components/ScrollProgress'
import CursorGlow from '@/components/CursorGlow'
import ScrollTopButton from '@/components/ScrollTopButton'
import SkipToContent from '@/components/SkipToContent'

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
      <section id="skills" className="section-shell" aria-labelledby="skills-heading">
        <Skills />
      </section>
      <section id="experience" className="section-shell" aria-labelledby="experience-heading">
        <Experience />
      </section>
      <section id="projects" className="section-shell" aria-labelledby="projects-heading">
        <Projects />
      </section>
      <section id="ai" className="section-shell" aria-labelledby="ai-heading">
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
