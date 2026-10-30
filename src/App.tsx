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
import AdminLayout, { RequireAuth } from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import ProfileAdmin from './admin/ProfileAdmin'
import SkillsAdmin from './admin/SkillsAdmin'
import ProjectsAdmin from './admin/ProjectsAdmin'
import PostsAdmin from './admin/PostsAdmin'
import SettingsAdmin from './admin/SettingsAdmin'
import { SiteDataProvider } from './store/siteData'

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (isAdmin) {
    return (
      <SiteDataProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="posts" element={<PostsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Routes>
      </SiteDataProvider>
    )
  }

  return (
    <SiteDataProvider>
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
    </SiteDataProvider>
  )
}
