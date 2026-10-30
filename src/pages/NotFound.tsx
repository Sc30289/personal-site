import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('页面未找到')

  return (
    <main id="main" className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#111827] sm:text-4xl">这里什么都没有</h1>
        <p className="mt-3 text-sm text-muted">页面可能被移动或删除了，回到首页继续逛逛吧。</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary">
            回到首页
            <Icon name="arrow-right" size={15} />
          </Link>
          <Link to="/blog" className="btn-ghost">
            看看博客
          </Link>
        </div>
      </div>
    </main>
  )
}
