# 技术设计文档（TECH_DESIGN）

> 项目：豆杰晟的个人网站 ｜ 版本：v1.0 ｜ 配套文档：`PRD.md`、`AGENTS.md`

## 一、选型结论

| 层 | 选择 | 理由 | 放弃的方案 |
| --- | --- | --- | --- |
| 框架 | React 18 | 组件化成熟、生态完整、招聘常用 | Vue（更轻但与既有项目不一致） |
| 语言 | TypeScript 5 | 类型约束减少低级错误，重构安全 | JavaScript |
| 构建 | Vite 5 | 冷启动快、配置少、产物精简 | Create React App（维护停滞） |
| 样式 | Tailwind CSS 3 + 少量自定义 CSS | 设计 token 统一、产出体积小、无需额外运行时 | CSS Modules（样式分散）、UI 组件库（过重） |
| 路由 | React Router 6（Hash 模式） | 静态托管无需服务端重写规则 | Browser 模式（GitHub Pages 刷新 404） |
| 内容 | Markdown + `import.meta.glob` | 写作零成本，构建时打包，无后端 | CMS（引入服务与成本） |
| 渲染 | react-markdown + remark-gfm + rehype | 安全（不执行 HTML）、支持表格与代码高亮 | marked（需额外处理 HTML 注入） |
| 后台 | 路由守卫 + localStorage 数据层 | 静态站也能改内容，后续可换真实 API | 真实后端（静态托管不需要） |
| 托管 | GitHub Pages | 免费、HTTPS、与代码同仓、可持续 | Vercel（需额外账号）、Netlify（同） |

## 二、总体架构

```text
┌─────────────────────────────────────────────────────────┐
│                       浏览器（SPA）                      │
│                                                          │
│  HashRouter ──► 页面组件（Home / Projects / Blog / ...） │
│      │                     │                             │
│      │                     ├── 组件层（Hero / Card / …）  │
│      │                     └── 内容层（content/*.ts）     │
│      │                                 │                 │
│      └──────────► Markdown 管线 ◄──────┘                 │
│                   remark-gfm → rehype-slug → highlight   │
└─────────────────────────────────────────────────────────┘
                              │
                    构建时（Vite / esbuild）
                              │
                   静态产物 dist/ → GitHub Pages
```

### 2.1 数据流

1. `src/content/*.ts` 导出结构化数据（个人资料、技能、项目）
2. `src/content/posts/*.md` 由 `import.meta.glob(..., { query: '?raw' })` 在构建期读入
3. `posts.ts` 解析 frontmatter、生成阅读时长与目录，按日期倒序导出
4. 页面组件消费数据；Markdown 正文交给 `Markdown` 组件渲染
5. 无运行期请求、无后端、无数据库

## 三、目录结构

```text
personal-site/
├── PRD.md                  # 产品需求文档
├── TECH_DESIGN.md          # 本文件
├── AGENTS.md               # AI 协作约定
├── index.html              # SPA 入口
├── vite.config.ts          # base / 构建配置
├── tailwind.config.js      # 设计 token
├── src/
│   ├── main.tsx            # 挂载 + HashRouter
│   ├── App.tsx             # 路由表 + 全局布局
│   ├── index.css           # Tailwind 指令 + 设计系统 + 代码主题
│   ├── admin/              # 管理后台（布局、登录、各管理页、UI 组件）
│   ├── store/
│   │   └── siteData.tsx    # 站点数据 Context + localStorage 持久化
│   ├── components/         # 可复用组件
│   │   ├── StarField.tsx   # Canvas 星空
│   │   ├── Navbar.tsx      # 吸顶导航 + 移动端菜单
│   │   ├── Hero.tsx        # 首屏
│   │   ├── About.tsx       # 关于 / 时间线
│   │   ├── Skills.tsx      # 技能条
│   │   ├── ProjectsSection.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── BlogSection.tsx
│   │   ├── Contact.tsx     # 表单 + 邮箱复制
│   │   ├── Markdown.tsx    # 渲染管线
│   │   └── Toc.tsx         # 目录 + 滚动高亮
│   ├── pages/              # 路由页面
│   │   ├── Home.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── BlogList.tsx
│   │   ├── BlogPost.tsx
│   │   └── NotFound.tsx
│   ├── content/
│   │   ├── profile.ts      # 个人信息
│   │   ├── skills.ts       # 技能
│   │   ├── projects.ts     # 项目（含详情 Markdown）
│   │   ├── posts.ts        # 文章加载与派生数据
│   │   └── posts/*.md      # 博客正文
│   ├── lib/markdown.ts     # frontmatter / TOC / 阅读时长
│   └── hooks/              # 自定义 hook
└── public/                 # 静态资源（favicon）
```

## 四、数据模型

```ts
interface Profile {
  name: string
  role: string
  status: string
  tagline: string
  intro: string[]
  email: string
  github: string
  focus: string[]
  stats: { label: string; value: string }[]
  timeline: { period: string; title: string; desc: string }[]
}

interface Project {
  slug: string
  title: string
  subtitle: string
  year: string
  category: 'web' | 'ext' | 'ai' | 'embedded'
  tags: string[]
  summary: string
  cover: { from: string; to: string; pattern: CoverPattern; mark: string }
  highlights: string[]
  links: { label: string; href: string; kind: 'github' | 'demo' | 'doc' }[]
  description: string   // Markdown 正文
}

interface Post {
  slug: string
  title: string
  date: string          // YYYY-MM-DD
  tags: string[]
  summary: string
  content: string
  readingTime: number
  toc: { id: string; text: string; level: 2 | 3 }[]
}
```

### 4.1 内容扩展成本

- 新增文章：在 `src/content/posts/` 加一个 `.md`，写好 frontmatter 即可，列表、标签、阅读时长、目录全部自动生成
- 新增项目：在 `projects.ts` 的数组里追加一个对象，`description` 直接写 Markdown
- 改个人信息：只改 `profile.ts`，全站引用同步更新

## 五、关键技术点

### 5.1 星空背景的性能控制

- 粒子数按面积计算：`min(220, max(36, w*h/11000))`
- 帧率节流：帧间隔小于 24ms 时跳过绘制（≈ 40fps 上限，视觉无差异）
- 页面不可见：`visibilitychange` 时 `cancelAnimationFrame`
- 视差：滚动位移 × 深度系数，鼠标位移做线性插值，避免抖动
- `prefers-reduced-motion`：只绘制一次静态星空
- DPR 上限取 2，避免高分屏过度绘制

```ts
const dpr = Math.min(window.devicePixelRatio || 1, 2)
canvas.width = width * dpr
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
```

### 5.2 Markdown 管线

```ts
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
/>
```

- `rehype-slug` 生成标题锚点，算法与 `github-slugger` 一致，因此 TOC 可以独立推导
- 不启用 `rehype-raw`，避免 Markdown 中的 HTML 注入
- 代码高亮使用自定义 Night Owl 配色，与站点主题一致

### 5.3 目录（TOC）与滚动高亮

1. 解析正文的 `##` / `###`，跳过代码块，得到 `{ text, level, id }`
2. `id` 由 `GithubSlugger` 生成，与渲染结果严格一致
3. `IntersectionObserver` 观察每个标题，`rootMargin: -15% 0 -70%`，取首个可见项高亮

### 5.4 路由与子路径部署

GitHub Pages 项目站点部署在 `https://<user>.github.io/<repo>/` 子路径下：

- `base: process.env.VITE_BASE || '/'`，构建时注入 `VITE_BASE=/personal-site/`
- 使用 `HashRouter`，地址形如 `/#/blog/xxx`，刷新与直达均不会 404
- 所有内部跳转用 `Link` / `useNavigate`，不使用裸 `<a href>`，避免脱离路由

### 5.5 联系表单（纯静态方案）

没有后端，表单提交分两步：

1. 前端校验：称呼非空、邮箱正则、留言 ≥ 10 字
2. 校验通过后拼接 `mailto:` 链接并跳转，唤起系统邮件客户端
3. 同时保留「一键复制邮箱」作为兜底

### 5.6 管理后台与本地数据层

后台挂在 `/admin` 下，与前台路由隔离：

- **登录**：`/#/admin/login`，演示账号 `admin / admin123`，登录态存 `localStorage`
- **路由守卫**：`RequireAuth` 组件在未登录时重定向到登录页
- **数据层**：`src/store/siteData.tsx` 提供 `SiteDataProvider`，把 `profile / skills / projects / posts / settings` 统一放进 Context，并同步写入 `localStorage`（key：`personal-site:data:v1`）
- **前台读取同一份数据**：`Hero`、`About`、`Skills`、`ProjectsSection`、`BlogList` 等组件改用 `useSiteData()`，后台保存后前台立即生效
- **数据管理**：站点设置页支持导出 / 导入 JSON、恢复默认，便于换浏览器时迁移

```ts
const { data, save } = useSiteData()
save({ profile: { ...data.profile, name: '豆杰晟' } })
```

> 当前是「本地数据」方案，适合课程演示与单人维护；要多人协作时，把 `store/siteData.tsx` 里的读写换成真实 API 即可，页面层无需改动。

## 六、样式系统

| Token | 值 | 用途 |
| --- | --- | --- |
| `ink-900` | `#120E0B` | 页面背景（暖黑） |
| `ink-800` | `#1A1410` | 卡片背景 |
| `mist` | `#F5EDE3` | 主文字 |
| `muted` | `#A99A88` | 次要文字 |
| `accent` | `#F59E0B` | 主强调色（琥珀） |
| `accent-violet` | `#FB7185` | 渐变终点（珊瑚） |
| 圆角 | 12–16px | 卡片 / 按钮 |
| 间距 | 4px 基准 | 8 / 12 / 16 / 24 / 32 |

字体：系统字体栈优先（`Segoe UI` / `PingFang SC` / `Microsoft YaHei`），代码使用 `Cascadia Code` / `Consolas`，不引入 Web Font，避免首屏阻塞。

## 七、性能与可访问性

- 构建产物：单页应用，JS gzip 后约 200KB，CSS 约 10KB
- 无图片资源：封面为 SVG 图案 + 渐变，图标为内联 SVG
- 路由级代码未做懒加载（页面总数少，收益低于复杂度），后续文章增多可改为 `React.lazy`
- 语义化：`header` / `nav` / `main` / `article` / `footer`，标题层级不跳级
- 键盘可达：所有按钮与链接有可见焦点，表单有 `label`

## 八、部署流程

```bash
# 本地开发
npm install
npm run dev            # http://localhost:5173

# 构建（子路径部署）
VITE_BASE=/personal-site/ npm run build

# 产物：dist/，把 dist 内容推到仓库并开启 GitHub Pages
```

部署要求：

1. 仓库 Settings → Pages → Source 选择分支与目录
2. 等待构建完成，访问 `https://<user>.github.io/<repo>/`
3. 修改代码后重新构建并推送，页面自动更新

## 九、风险与对策

| 风险 | 对策 |
| --- | --- |
| 子路径导致白屏 | 构建时统一注入 `VITE_BASE`，预览与线上分别验证 |
| 星空在低端机掉帧 | 粒子数按面积裁剪 + 帧间隔节流 + 不可见暂停 |
| 文章增多后首屏变慢 | 当前 4 篇无压力；超过 20 篇时改为按需加载正文 |
| Markdown 中出现危险 HTML | 不启用 `rehype-raw`，原始 HTML 按文本转义 |
| 表单被当作真实后端 | 文案明确说明「会打开邮件客户端」，并提供邮箱复制 |
