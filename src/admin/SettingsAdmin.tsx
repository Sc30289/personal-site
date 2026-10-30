import { useState } from 'react'
import { useSiteData } from '../store/siteData'
import { AdminCard, Field, MiniButton, SaveBar, TextArea, TextInput, Toast } from './ui'

export default function SettingsAdmin() {
  const { data, save, reset, exportData, importData } = useSiteData()
  const [draft, setDraft] = useState(() => ({ ...data.settings }))
  const [importText, setImportText] = useState('')
  const [toast, setToast] = useState('')

  const update = (patch: Record<string, unknown>) => setDraft((prev) => ({ ...prev, ...patch }))

  const onSave = () => {
    save({ settings: draft })
    setToast('站点设置已保存')
    window.setTimeout(() => setToast(''), 2000)
  }

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'personal-site-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">站点设置</h1>
        <p className="mt-1 text-[12px] text-muted">标题、描述与数据备份</p>
      </div>

      <AdminCard title="基础信息">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="站点标题">
            <TextInput value={draft.siteTitle} onChange={(e) => update({ siteTitle: e.target.value })} />
          </Field>
          <Field label="作者">
            <TextInput value={draft.author} onChange={(e) => update({ author: e.target.value })} />
          </Field>
          <Field label="站点描述" className="sm:col-span-2">
            <TextArea rows={2} value={draft.siteDescription} onChange={(e) => update({ siteDescription: e.target.value })} />
          </Field>
          <Field label="页脚一句话" className="sm:col-span-2">
            <TextInput value={draft.footerNote} onChange={(e) => update({ footerNote: e.target.value })} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="数据管理" desc="localStorage 中的数据可以导出备份或恢复默认">
        <div className="flex flex-wrap gap-2">
          <MiniButton onClick={download}>导出 JSON</MiniButton>
          <MiniButton
            variant="ghost"
            onClick={() => {
              if (window.confirm('恢复默认数据？当前修改会被清空。')) {
                reset()
                setDraft({ ...data.settings })
                setToast('已恢复默认数据')
                window.setTimeout(() => setToast(''), 2000)
              }
            }}
          >
            恢复默认
          </MiniButton>
        </div>

        <Field label="导入 JSON" hint="粘贴之前导出的内容，覆盖当前数据" className="mt-5">
          <TextArea rows={6} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder='{"profile": ...}' />
        </Field>
        <div className="mt-3">
          <MiniButton
            onClick={() => {
              if (!importText.trim()) return
              const ok = importData(importText)
              setToast(ok ? '导入成功' : 'JSON 格式不正确')
              window.setTimeout(() => setToast(''), 2000)
            }}
          >
            导入数据
          </MiniButton>
        </div>
      </AdminCard>

      <SaveBar onSave={onSave} />
      <Toast message={toast} />
    </div>
  )
}
