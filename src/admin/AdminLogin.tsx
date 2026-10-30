import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { isAuthed, login } from './auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthed()) return <Navigate to="/admin" replace />

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (login(username, password)) {
      navigate('/admin', { replace: true })
    } else {
      setError('账号或密码不正确')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-violet text-base font-semibold text-ink-950">
            豆
          </span>
          <h1 className="mt-4 text-xl font-semibold text-white">管理后台</h1>
          <p className="mt-1 text-[12px] text-muted">登录后可编辑个人信息、技能、项目与博客</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/[0.07] bg-ink-800/60 p-6">
          <label className="block text-[12px] text-muted">
            账号
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900/70 px-3.5 py-2.5 text-[13px] text-mist focus:border-accent/60 focus:outline-none"
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-[12px] text-muted">
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900/70 px-3.5 py-2.5 text-[13px] text-mist focus:border-accent/60 focus:outline-none"
              autoComplete="current-password"
              placeholder="admin123"
            />
          </label>

          {error ? <p className="mt-3 text-[12px] text-rose-300">{error}</p> : null}

          <button type="submit" className="btn-primary mt-6 w-full justify-center">
            登录
          </button>

          <p className="mt-4 text-center text-[11px] text-muted/60">演示账号 admin ／ 密码 admin123</p>
        </form>

        <p className="mt-5 text-center text-[12px]">
          <Link to="/" className="text-muted hover:text-white">
            ← 返回站点
          </Link>
        </p>
      </div>
    </div>
  )
}
