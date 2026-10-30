import { useState } from 'react'
import { useSiteData } from '../store/siteData'
import { AdminCard, Field, MiniButton, SaveBar, Select, TextArea, TextInput, Toast } from './ui'

const icons = ['code', 'layers', 'spark', 'chip']

export default function SkillsAdmin() {
  const { data, save } = useSiteData()
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(data.skills)))
  const [toolboxText, setToolboxText] = useState(data.toolbox.join('，'))
  const [toast, setToast] = useState('')

  const updateGroup = (index: number, patch: Record<string, unknown>) => {
    const next = [...draft]
    next[index] = { ...next[index], ...patch }
    setDraft(next)
  }

  const updateSkill = (gi: number, si: number, patch: Record<string, unknown>) => {
    const next = JSON.parse(JSON.stringify(draft))
    next[gi].skills[si] = { ...next[gi].skills[si], ...patch }
    setDraft(next)
  }

  const onSave = () => {
    save({
      skills: draft,
      toolbox: toolboxText
        .split(/[，,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    })
    setToast('技能已保存')
    window.setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">技能管理</h1>
          <p className="mt-1 text-[12px] text-muted">按方向分组，熟练度 0–100</p>
        </div>
        <MiniButton
          onClick={() =>
            setDraft([...draft, { key: `group-${Date.now()}`, title: '新分组', subtitle: '一句话描述', icon: 'code', skills: [] }])
          }
        >
          + 新增分组
        </MiniButton>
      </div>

      {draft.map((group: any, gi: number) => (
        <AdminCard
          key={group.key}
          title={group.title}
          actions={
            <MiniButton variant="danger" onClick={() => setDraft(draft.filter((_: unknown, i: number) => i !== gi))}>
              删除分组
            </MiniButton>
          }
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="标题">
              <TextInput value={group.title} onChange={(e) => updateGroup(gi, { title: e.target.value })} />
            </Field>
            <Field label="副标题">
              <TextInput value={group.subtitle} onChange={(e) => updateGroup(gi, { subtitle: e.target.value })} />
            </Field>
            <Field label="图标">
              <Select value={group.icon} onChange={(e) => updateGroup(gi, { icon: e.target.value })}>
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-4 space-y-3">
            {group.skills.map((skill: any, si: number) => (
              <div key={si} className="grid items-end gap-2 rounded-xl border border-black/[0.06] p-3 sm:grid-cols-[1fr_90px_1.4fr_auto]">
                <Field label="名称">
                  <TextInput value={skill.name} onChange={(e) => updateSkill(gi, si, { name: e.target.value })} />
                </Field>
                <Field label="熟练度">
                  <TextInput
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(e) => updateSkill(gi, si, { level: Number(e.target.value) })}
                  />
                </Field>
                <Field label="说明">
                  <TextInput value={skill.note ?? ''} onChange={(e) => updateSkill(gi, si, { note: e.target.value })} />
                </Field>
                <button
                  type="button"
                  onClick={() => {
                    const next = JSON.parse(JSON.stringify(draft))
                    next[gi].skills = next[gi].skills.filter((_: unknown, i: number) => i !== si)
                    setDraft(next)
                  }}
                  className="pb-2 text-[11px] text-rose-600 hover:text-rose-700"
                >
                  删除
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <MiniButton
              onClick={() => {
                const next = JSON.parse(JSON.stringify(draft))
                next[gi].skills.push({ name: '新技能', level: 70, note: '' })
                setDraft(next)
              }}
            >
              + 新增技能
            </MiniButton>
          </div>
        </AdminCard>
      ))}

      <AdminCard title="工具箱" desc="用逗号分隔">
        <TextArea rows={2} value={toolboxText} onChange={(e) => setToolboxText(e.target.value)} />
      </AdminCard>

      <SaveBar onSave={onSave} />
      <Toast message={toast} />
    </div>
  )
}
