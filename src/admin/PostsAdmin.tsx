import { useState } from 'react'
import Markdown from '../components/Markdown'
import { useSiteData } from '../store/siteData'
import { AdminCard, Field, MiniButton, SaveBar, TextArea, TextInput, Toast } from './ui'

export default function PostsAdmin() {
  const { data, save } = useSiteData()
  const [list, setList] = useState(() => JSON.parse(JSON.stringify(data.posts)))
  const [editing, setEditing] = useState<number | null>(null)
  const [preview, setPreview] = useState(false)
  const [toast, setToast] = useState('')

  const update = (patch: Record<string, unknown>) => {
    if (editing === null) return
    const next = [...list]
    next[editing] = { ...next[editing], ...patch }
    setList(next)
  }

  const saveAll = () => {
    save({ posts: list })
    setToast('文章已保存')
    window.setTimeout(() => setToast(''), 2000)
  }

  if (editing !== null) {
    const post = list[editing]
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">编辑文章</h1>
            <p className="mt-1 text-[12px] text-muted">{post.title}</p>
          </div>
          <MiniButton onClick={() => setEditing(null)}>← 返回列表</MiniButton>
        </div>

        <AdminCard title="文章信息">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="标题" required>
              <TextInput value={post.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Slug（路由）" required>
              <TextInput value={post.slug} onChange={(e) => update({ slug: e.target.value })} />
            </Field>
            <Field label="日期" hint="YYYY-MM-DD">
              <TextInput value={post.date} onChange={(e) => update({ date: e.target.value })} />
            </Field>
            <Field label="标签" hint="用逗号分隔">
              <TextInput
                value={post.tags.join('，')}
                onChange={(e) => update({ tags: e.target.value.split(/[，,]/).map((t) => t.trim()).filter(Boolean) })}
              />
            </Field>
            <Field label="摘要" className="sm:col-span-2">
              <TextArea rows={2} value={post.summary} onChange={(e) => update({ summary: e.target.value })} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard
          title="正文"
          desc="支持 Markdown，## / ### 会进入右侧目录"
          actions={
            <MiniButton onClick={() => setPreview((value) => !value)}>{preview ? '编辑' : '预览'}</MiniButton>
          }
        >
          {preview ? (
            <div className="rounded-xl border border-white/[0.06] p-4">
              <Markdown content={post.content} />
            </div>
          ) : (
            <TextArea rows={16} value={post.content} onChange={(e) => update({ content: e.target.value })} />
          )}
        </AdminCard>

        <SaveBar onSave={saveAll} />
        <Toast message={toast} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">博客管理</h1>
          <p className="mt-1 text-[12px] text-muted">共 {list.length} 篇文章</p>
        </div>
        <MiniButton
          onClick={() => {
            const today = new Date().toISOString().slice(0, 10)
            setList([
              ...list,
              {
                slug: `post-${Date.now()}`,
                title: '新文章',
                date: today,
                tags: ['随笔'],
                summary: '摘要',
                content: '## 小节标题\n\n正文…',
              },
            ])
            setEditing(list.length)
          }}
        >
          + 新建文章
        </MiniButton>
      </div>

      <AdminCard>
        <div className="divide-y divide-white/[0.06]">
          {list.map((post: any, index: number) => (
            <div key={post.slug + index} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-white">{post.title}</p>
                <p className="truncate text-[11px] text-muted">{post.slug} · {post.date} · {post.tags.join(' / ')}</p>
              </div>
              <MiniButton onClick={() => setEditing(index)}>编辑</MiniButton>
              <MiniButton
                variant="danger"
                onClick={() => {
                  if (window.confirm(`删除文章「${post.title}」？`)) {
                    setList(list.filter((_: unknown, i: number) => i !== index))
                  }
                }}
              >
                删除
              </MiniButton>
            </div>
          ))}
        </div>
      </AdminCard>

      <SaveBar onSave={saveAll} />
      <Toast message={toast} />
    </div>
  )
}
