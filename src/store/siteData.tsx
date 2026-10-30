import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { profile as defaultProfile, type Profile } from '../content/profile'
import { skillGroups as defaultSkills, toolbox as defaultToolbox, type SkillGroup } from '../content/skills'
import { projects as defaultProjects, type Project } from '../content/projects'
import { posts as defaultPosts } from '../content/posts'
import { extractToc, estimateReadingTime, type TocItem } from '../lib/markdown'

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  footerNote: string
  author: string
}

export interface PostDraft {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
}

export interface PostWithMeta extends PostDraft {
  readingTime: number
  toc: TocItem[]
}

export interface SiteData {
  profile: Profile
  skills: SkillGroup[]
  toolbox: string[]
  projects: Project[]
  posts: PostDraft[]
  settings: SiteSettings
  /** 默认内容版本号：内容层面大改时 +1，用来让旧的 localStorage 快照失效 */
  contentVersion?: number
}

const STORAGE_KEY = 'personal-site:data:v1'
const CONTENT_VERSION = 2

const defaultSettings: SiteSettings = {
  siteTitle: '豆杰晟 · 个人网站',
  siteDescription:
    '豆杰晟的个人网站：大连民族大学物联网工程专业 2024 级本科生，关注前端工程、物联网应用与 AI。',
  footerNote: '用作品记录成长，用文字沉淀思考。',
  author: '豆杰晟',
}

const defaultData: SiteData = {
  profile: defaultProfile,
  skills: defaultSkills,
  toolbox: defaultToolbox,
  projects: defaultProjects,
  posts: defaultPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    summary: post.summary,
    content: post.content,
  })),
  settings: defaultSettings,
  contentVersion: CONTENT_VERSION,
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function loadStored(): SiteData {
  if (typeof window === 'undefined') return clone(defaultData)
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return clone(defaultData)
    const parsed = JSON.parse(raw) as Partial<SiteData>
    // 旧快照（内容版本更低）里的项目数据是旧的，这条目改了文案后必须用默认值覆盖，
    // 否则作者自己的浏览器会一直显示上一版；其余数据（文章、个人信息）照常保留。
    const freshProjects = (parsed.contentVersion ?? 1) >= CONTENT_VERSION
    return {
      profile: { ...clone(defaultData.profile), ...(parsed.profile ?? {}) },
      skills: parsed.skills ?? clone(defaultData.skills),
      toolbox: parsed.toolbox ?? clone(defaultData.toolbox),
      projects: freshProjects && parsed.projects ? parsed.projects : clone(defaultData.projects),
      posts: parsed.posts ?? clone(defaultData.posts),
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      contentVersion: CONTENT_VERSION,
    }
  } catch {
    return clone(defaultData)
  }
}

interface SiteDataContextValue {
  data: SiteData
  posts: PostWithMeta[]
  featured: Project[]
  others: Project[]
  save: (patch: Partial<SiteData>) => void
  reset: () => void
  importData: (json: string) => boolean
  exportData: () => string
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => loadStored())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* 存储不可用时静默降级为仅本次会话生效 */
    }
  }, [data])

  // 后台在另一个标签页保存时，前台标签页实时同步
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue) as Partial<SiteData>
        setData((prev) => ({
          profile: { ...prev.profile, ...(parsed.profile ?? {}) },
          skills: parsed.skills ?? prev.skills,
          toolbox: parsed.toolbox ?? prev.toolbox,
          projects: parsed.projects ?? prev.projects,
          posts: parsed.posts ?? prev.posts,
          settings: { ...prev.settings, ...(parsed.settings ?? {}) },
        }))
      } catch {
        /* 忽略损坏的数据 */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((patch: Partial<SiteData>) => {
    setData((prev) => ({ ...prev, ...patch, settings: { ...prev.settings, ...(patch.settings ?? {}) } }))
  }, [])

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setData(clone(defaultData))
  }, [])

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data])

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<SiteData>
      if (!parsed || typeof parsed !== 'object') return false
      setData({
        profile: { ...clone(defaultData.profile), ...(parsed.profile ?? {}) },
        skills: parsed.skills ?? clone(defaultData.skills),
        toolbox: parsed.toolbox ?? clone(defaultData.toolbox),
        projects: parsed.projects ?? clone(defaultData.projects),
        posts: parsed.posts ?? clone(defaultData.posts),
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      })
      return true
    } catch {
      return false
    }
  }, [])

  const posts = useMemo<PostWithMeta[]>(
    () =>
      data.posts
        .map((post) => ({
          ...post,
          readingTime: estimateReadingTime(post.content),
          toc: extractToc(post.content),
        }))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.posts],
  )

  const featured = useMemo(() => data.projects.filter((project) => project.featured), [data.projects])
  const others = useMemo(() => data.projects.filter((project) => !project.featured), [data.projects])

  const value = useMemo<SiteDataContextValue>(
    () => ({ data, posts, featured, others, save, reset, importData, exportData }),
    [data, posts, featured, others, save, reset, importData, exportData],
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData(): SiteDataContextValue {
  const value = useContext(SiteDataContext)
  if (!value) throw new Error('useSiteData 必须在 SiteDataProvider 内使用')
  return value
}

export { defaultData }
