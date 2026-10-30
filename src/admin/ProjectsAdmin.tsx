import { useState } from 'react'
import { useSiteData } from '../store/siteData'
import { AdminCard, Field, MiniButton, SaveBar, Select, TextArea, TextInput, Toast } from './ui'

const categories = [
  { key: 'web', label: '前端' },
  { key: 'ext', label: '扩展' },
  { key: 'ai', label: 'AI' },
  { key: 'embedded', label: '嵌入式' },
]

const patterns = ['grid', 'orbit', 'wave', 'circuit', 'stamp']

export default function ProjectsAdmin() {
  const { data, save } = useSiteData()
  const [list, setList] = useState(() => JSON.parse(JSON.stringify(data.projects)))
  const [editing, setEditing] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  const update = (patch: Record<string, unknown>) => {
    if (editing === null) return
    const next = [...list]
    next[editing] = { ...next[editing], ...patch }
    setList(next)
  }

  const saveAll = () => {
    save({ projects: list })
    setToast('作品已保存')
    window.setTimeout(() => setToast(''), 2000)
  }

  if (editing !== null) {
    const project = list[editing]
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">编辑作品</h1>
            <p className="mt-1 text-[12px] text-muted">{project.title}</p>
          </div>
          <MiniButton onClick={() => setEditing(null)}>← 返回列表</MiniButton>
        </div>

        <AdminCard title="基本信息">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="标题" required>
              <TextInput value={project.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Slug（路由）" required>
              <TextInput value={project.slug} onChange={(e) => update({ slug: e.target.value })} />
            </Field>
            <Field label="副标题" className="sm:col-span-2">
              <TextInput value={project.subtitle} onChange={(e) => update({ subtitle: e.target.value })} />
            </Field>
            <Field label="年份">
              <TextInput value={project.year} onChange={(e) => update({ year: e.target.value })} />
            </Field>
            <Field label="分类">
              <Select value={project.category} onChange={(e) => update({ category: e.target.value })}>
                {categories.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="标签" hint="用逗号分隔" className="sm:col-span-2">
              <TextInput
                value={project.tags.join('，')}
                onChange={(e) => update({ tags: e.target.value.split(/[，,]/).map((t) => t.trim()).filter(Boolean) })}
              />
            </Field>
            <Field label="简介" className="sm:col-span-2">
              <TextArea rows={3} value={project.summary} onChange={(e) => update({ summary: e.target.value })} />
            </Field>
            <Field label="首页精选">
              <label className="flex items-center gap-2 text-[12px] text-mist">
                <input
                  type="checkbox"
                  checked={Boolean(project.featured)}
                  onChange={(e) => update({ featured: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
                在首页「精选作品」展示
              </label>
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="封面">
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="起始色">
              <TextInput value={project.cover.from} onChange={(e) => update({ cover: { ...project.cover, from: e.target.value } })} />
            </Field>
            <Field label="结束色">
              <TextInput value={project.cover.to} onChange={(e) => update({ cover: { ...project.cover, to: e.target.value } })} />
            </Field>
            <Field label="图案">
              <Select value={project.cover.pattern} onChange={(e) => update({ cover: { ...project.cover, pattern: e.target.value } })}>
                {patterns.map((pattern) => (
                  <option key={pattern} value={pattern}>
                    {pattern}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="角标">
              <TextInput value={project.cover.mark} onChange={(e) => update({ cover: { ...project.cover, mark: e.target.value } })} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="亮点" desc="每行一条">
          <TextArea
            rows={4}
            value={project.highlights.join('\n')}
            onChange={(e) => update({ highlights: e.target.value.split('\n').filter((line) => line.trim()) })}
          />
        </AdminCard>

        <AdminCard title="链接" desc="每行：名称|地址|类型（github / demo / doc）">
          <TextArea
            rows={3}
            value={project.links.map((link: any) => `${link.label}|${link.href}|${link.kind}`).join('\n')}
            onChange={(e) =>
              update({
                links: e.target.value
                  .split('\n')
                  .map((line) => line.split('|').map((part) => part.trim()))
                  .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
                  .map((parts) => ({ label: parts[0], href: parts[1], kind: parts[2] || 'demo' })),
              })
            }
          />
        </AdminCard>

        <AdminCard title="详情正文" desc="支持 Markdown">
          <TextArea rows={12} value={project.description} onChange={(e) => update({ description: e.target.value })} />
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
          <h1 className="text-xl font-semibold text-[#111827]">项目管理</h1>
          <p className="mt-1 text-[12px] text-muted">共 {list.length} 个作品</p>
        </div>
        <MiniButton
          onClick={() => {
            setList([
              ...list,
              {
                slug: `project-${Date.now()}`,
                title: '新作品',
                subtitle: '一句话说明',
                year: '2026',
                category: 'web',
                tags: ['标签'],
                summary: '作品简介',
                cover: { from: '#f59e0b', to: '#fb7185', pattern: 'grid', mark: 'NEW' },
                highlights: [],
                links: [],
                description: '## 背景\n\n写点什么…',
                featured: false,
              },
            ])
            setEditing(list.length)
          }}
        >
          + 新建作品
        </MiniButton>
      </div>

      <AdminCard>
        <div className="divide-y divide-black/[0.06]">
          {list.map((project: any, index: number) => (
            <div key={project.slug + index} className="flex flex-wrap items-center gap-3 py-3">
              <span className="h-9 w-12 rounded-md" style={{ backgroundImage: `linear-gradient(135deg, ${project.cover.from}, ${project.cover.to})` }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-[#111827]">{project.title}</p>
                <p className="truncate text-[11px] text-muted">/{project.slug} · {project.category}</p>
              </div>
              {project.featured ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">精选</span> : null}
              <MiniButton onClick={() => setEditing(index)}>编辑</MiniButton>
              <MiniButton
                variant="danger"
                onClick={() => {
                  if (window.confirm(`删除作品「${project.title}」？`)) {
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
