import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import ProjectsPage from './pages/ProjectsPage'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <BackToTop />
    </div>
  )
}
