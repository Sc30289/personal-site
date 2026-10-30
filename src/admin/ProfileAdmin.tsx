import { useState } from 'react'
import { useSiteData } from '../store/siteData'
import { AdminCard, Field, MiniButton, SaveBar, TextArea, TextInput, Toast } from './ui'

export default function ProfileAdmin() {
  const { data, save } = useSiteData()
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(data.profile)))
  const [toast, setToast] = useState('')

  const update = (patch: Record<string, unknown>) => setDraft((prev: Record<string, unknown>) => ({ ...prev, ...patch }))

  const onSave = () => {
    const intro = String(draft.introText ?? '')
      .split(/\n{2,}/)
      .map((item: string) => item.trim())
      .filter(Boolean)
    save({
      profile: {
        ...draft,
        intro,
        focus: String(draft.focusText ?? '')
          .split(/[，,]/)
          .map((item: string) => item.trim())
          .filter(Boolean),
      },
    })
    setToast('个人信息已保存')
    window.setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">个人信息</h1>
        <p className="mt-1 text-[12px] text-muted">管理个人资料、经历与教育背景</p>
      </div>

      <AdminCard title="基本信息">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="姓名" required>
            <TextInput value={draft.name} onChange={(e) => update({ name: e.target.value })} />
          </Field>
          <Field label="职位 / 头衔" required>
            <TextInput value={draft.role} onChange={(e) => update({ role: e.target.value })} />
          </Field>
          <Field label="一句话介绍" className="sm:col-span-2">
            <TextInput value={draft.tagline} onChange={(e) => update({ tagline: e.target.value })} />
          </Field>
          <Field label="邮箱" required>
            <TextInput value={draft.email} onChange={(e) => update({ email: e.target.value })} />
          </Field>
          <Field label="所在地区">
            <TextInput value={draft.location} onChange={(e) => update({ location: e.target.value })} />
          </Field>
          <Field label="学校">
            <TextInput value={draft.school} onChange={(e) => update({ school: e.target.value })} />
          </Field>
          <Field label="状态" hint="显示在首页徽标里">
            <TextInput value={draft.status} onChange={(e) => update({ status: e.target.value })} />
          </Field>
          <Field label="头像字母" hint="资料卡上的字母缩写">
            <TextInput value={draft.initials} onChange={(e) => update({ initials: e.target.value })} />
          </Field>
          <Field label="Logo 字" hint="导航栏左侧的字">
            <TextInput value={draft.logo} onChange={(e) => update({ logo: e.target.value })} />
          </Field>
          <Field label="技术方向" hint="用中文逗号分隔，例如：前端工程，AI 应用" className="sm:col-span-2">
            <TextInput
              value={draft.focusText ?? data.profile.focus.join('，')}
              onChange={(e) => update({ focusText: e.target.value })}
            />
          </Field>
          <Field label="GitHub">
            <TextInput value={draft.github} onChange={(e) => update({ github: e.target.value })} />
          </Field>
          <Field label="GitHub 用户名">
            <TextInput value={draft.githubName} onChange={(e) => update({ githubName: e.target.value })} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="个人简介" desc="段落之间空一行">
        <TextArea
          rows={5}
          value={draft.introText ?? data.profile.intro.join('\n\n')}
          onChange={(e) => update({ introText: e.target.value })}
        />
      </AdminCard>

      <AdminCard
        title="数据概览"
        desc="首页资料卡上的四个数字"
        actions={<MiniButton onClick={() => update({ stats: [...draft.stats, { label: '新指标', value: '0' }] })}>+ 新增</MiniButton>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {draft.stats.map((stat: { label: string; value: string }, index: number) => (
            <div key={index} className="flex items-end gap-2">
              <Field label="标签" className="flex-1">
                <TextInput
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...draft.stats]
                    stats[index] = { ...stats[index], label: e.target.value }
                    update({ stats })
                  }}
                />
              </Field>
              <Field label="数值" className="w-24">
                <TextInput
                  value={stat.value}
                  onChange={(e) => {
                    const stats = [...draft.stats]
                    stats[index] = { ...stats[index], value: e.target.value }
                    update({ stats })
                  }}
                />
              </Field>
              <button
                type="button"
                onClick={() => update({ stats: draft.stats.filter((_: unknown, i: number) => i !== index) })}
                className="mb-2 text-[11px] text-rose-300 hover:text-rose-200"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="时间线"
        desc="关于页的成长经历"
        actions={<MiniButton onClick={() => update({ timeline: [...draft.timeline, { period: '2026.01', title: '新经历', desc: '描述' }] })}>+ 新增</MiniButton>}
      >
        <div className="space-y-4">
          {draft.timeline.map((item: { period: string; title: string; desc: string }, index: number) => (
            <div key={index} className="rounded-xl border border-white/[0.06] p-4">
              <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto]">
                <Field label="时间">
                  <TextInput
                    value={item.period}
                    onChange={(e) => {
                      const timeline = [...draft.timeline]
                      timeline[index] = { ...timeline[index], period: e.target.value }
                      update({ timeline })
                    }}
                  />
                </Field>
                <Field label="标题">
                  <TextInput
                    value={item.title}
                    onChange={(e) => {
                      const timeline = [...draft.timeline]
                      timeline[index] = { ...timeline[index], title: e.target.value }
                      update({ timeline })
                    }}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => update({ timeline: draft.timeline.filter((_: unknown, i: number) => i !== index) })}
                  className="self-end pb-2 text-[11px] text-rose-300 hover:text-rose-200"
                >
                  删除
                </button>
              </div>
              <Field label="描述" className="mt-3">
                <TextArea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const timeline = [...draft.timeline]
                    timeline[index] = { ...timeline[index], desc: e.target.value }
                    update({ timeline })
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      </AdminCard>

      <SaveBar onSave={onSave} />
      <Toast message={toast} />
    </div>
  )
}
