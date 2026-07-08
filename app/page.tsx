import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import AiUseCases from '@/components/AiUseCases'
import ContactGate from '@/components/ContactGate'

export default function Home() {
  return (
    <main id="top">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="about" className="section-shell">
        <About />
      </section>
      <section id="skills" className="section-shell">
        <Skills />
      </section>
      <section id="experience" className="section-shell">
        <Experience />
      </section>
      <section id="projects" className="section-shell">
        <Projects />
      </section>
      <section id="ai" className="section-shell">
        <AiUseCases />
      </section>
      <section id="contact" className="section-shell">
        <ContactGate />
      </section>
      <Footer />
    </main>
  )
}
