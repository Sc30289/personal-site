import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import ProjectsSection from '../components/ProjectsSection'
import BlogSection from '../components/BlogSection'
import Contact from '../components/Contact'
import TechMarquee from '../components/TechMarquee'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle()

  return (
    <main id="main">
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <ProjectsSection />
      <BlogSection />
      <Contact />
    </main>
  )
}
