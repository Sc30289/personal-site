import { useState, type FormEvent } from 'react'
import { profile } from '../content/profile'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

interface FormState {
  name: string
  email: string
  message: string
}

const emptyForm: FormState = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const area = document.createElement('textarea')
      area.value = profile.email
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const update = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = '请填写你的称呼'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = '请填写有效的邮箱地址'
    if (form.message.trim().length < 10) next.message = '留言至少 10 个字，方便我了解你的意思'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    const subject = encodeURIComponent(`来自个人网站的留言 · ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n—— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
    setForm(emptyForm)
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="05 / Contact"
          title="一起做点有趣的东西"
          desc="实习机会、项目合作，或者只是聊聊技术，都欢迎给我发邮件。"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="card relative flex h-full flex-col justify-between overflow-hidden p-7">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm text-muted">直接联系</p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group mt-3 inline-flex items-center gap-3 text-left text-xl font-medium text-white transition-colors hover:text-accent sm:text-2xl"
                >
                  {profile.email}
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                    <Icon name={copied ? 'check' : 'copy'} size={14} />
                  </span>
                </button>
                <p className={`mt-2 text-xs transition-opacity ${copied ? 'text-emerald-300' : 'text-transparent'}`}>
                  已复制到剪贴板
                </p>
                <p className="mt-4 max-w-xs text-[12.5px] leading-6 text-muted/80">
                  实习、项目合作，或者只是想聊聊技术，都欢迎来信。我会尽快回复。
                </p>

                <div className="mt-8 space-y-3 text-[13px] text-muted">
                  <p className="flex items-center gap-2">
                    <Icon name="map-pin" size={15} className="text-accent" />
                    {profile.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="github" size={15} className="text-accent" />
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      github.com/{profile.githubName}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="clock" size={15} className="text-accent" />
                    通常 1–2 天内回复
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                {profile.focus.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form onSubmit={onSubmit} noValidate className="card p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] text-muted">你的称呼</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => update('name')(event.target.value)}
                    placeholder="怎么称呼你"
                    className={`mt-2 w-full rounded-xl border bg-ink-900/60 px-4 py-2.5 text-sm text-mist placeholder:text-muted/50 focus:border-accent/60 focus:outline-none ${
                      errors.name ? 'border-rose-400/60' : 'border-white/10'
                    }`}
                  />
                  {errors.name ? <span className="mt-1 block text-[11px] text-rose-300">{errors.name}</span> : null}
                </label>

                <label className="block">
                  <span className="text-[12px] text-muted">邮箱</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email')(event.target.value)}
                    placeholder="you@example.com"
                    className={`mt-2 w-full rounded-xl border bg-ink-900/60 px-4 py-2.5 text-sm text-mist placeholder:text-muted/50 focus:border-accent/60 focus:outline-none ${
                      errors.email ? 'border-rose-400/60' : 'border-white/10'
                    }`}
                  />
                  {errors.email ? (
                    <span className="mt-1 block text-[11px] text-rose-300">{errors.email}</span>
                  ) : null}
                </label>
              </div>

              <label className="mt-5 block">
                <span className="text-[12px] text-muted">想说的内容</span>
                <textarea
                  value={form.message}
                  onChange={(event) => update('message')(event.target.value)}
                  rows={5}
                  placeholder="简单介绍一下你的想法或需求…"
                  className={`mt-2 w-full resize-y rounded-xl border bg-ink-900/60 px-4 py-3 text-sm leading-6 text-mist placeholder:text-muted/50 focus:border-accent/60 focus:outline-none ${
                    errors.message ? 'border-rose-400/60' : 'border-white/10'
                  }`}
                />
                {errors.message ? (
                  <span className="mt-1 block text-[11px] text-rose-300">{errors.message}</span>
                ) : null}
              </label>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[11px] text-muted/70">
                  提交后会打开你的邮件客户端，内容会自动填好。
                </p>
                <button type="submit" className="btn-primary">
                  <Icon name="send" size={15} />
                  发送留言
                </button>
              </div>

              {sent ? (
                <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-[13px] text-emerald-200">
                  已为你打开邮件客户端。如果没有反应，也可以直接复制上面的邮箱发信。
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
