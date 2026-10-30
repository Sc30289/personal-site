import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function AdminCard({
  title,
  desc,
  actions,
  children,
}: {
  title?: string
  desc?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-black/[0.07] bg-ink-800/60 p-6 shadow-card">
      {title ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
            {desc ? <p className="mt-1 text-[12px] text-muted">{desc}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Field({
  label,
  hint,
  required,
  children,
  className = '',
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-baseline gap-1 text-[12px] text-muted">
        {label}
        {required ? <span className="text-rose-400">*</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] text-muted/60">{hint}</span> : null}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-black/10 bg-ink-900/70 px-3.5 py-2.5 text-[13px] text-mist placeholder:text-muted/40 transition-colors focus:border-accent/60 focus:outline-none'

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-y leading-6 ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function SaveBar({ onSave, saving, extra }: { onSave: () => void; saving?: boolean; extra?: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.07] bg-ink-900/90 p-4 backdrop-blur">
      <p className="text-[11px] text-muted/70">数据保存在本地浏览器（localStorage），公开站点会读取同一份数据。</p>
      <div className="flex items-center gap-2">
        {extra}
        <button
          type="button"
          onClick={onSave}
          className="btn-primary text-[13px]"
          disabled={saving}
        >
          {saving ? '保存中…' : '保存修改'}
        </button>
      </div>
    </div>
  )
}

export function Toast({ message }: { message: string }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-5 py-2 text-[12px] text-emerald-700 backdrop-blur transition-all ${
        message ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="status"
    >
      {message || '已保存'}
    </div>
  )
}

export function MiniButton({
  children,
  onClick,
  variant = 'ghost',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'ghost' | 'danger' | 'primary'
  type?: 'button' | 'submit'
}) {
  const styles = {
    ghost: 'border border-black/10 text-muted hover:text-[#111827] hover:border-accent/40',
    danger: 'border border-rose-400/30 text-rose-600 hover:bg-rose-400/10',
    primary: 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] transition-colors ${styles}`}
    >
      {children}
    </button>
  )
}
