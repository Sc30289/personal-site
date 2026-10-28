# AGENTS.md

> 面向 AI 代理与协作者的项目说明书。动手改代码之前，请先读完本文件。

## 一、项目概述

这是 **豆杰晟的个人网站**：一个深色星空主题的个人作品集 + 博客，纯静态部署在 GitHub Pages。

- 站点目标：介绍自己、展示项目、沉淀文章、提供联系入口
- 使用人群：招聘方、同学、开发者
- 当前版本：v1.0（首页 / 项目 / 博客 / 联系 / 404）

## 二、技术栈（硬性约束）

| 项 | 约束 |
| --- | --- |
| 框架 | React 18 + TypeScript 5（严格模式） |
| 构建 | Vite 5，`base` 由 `VITE_BASE` 环境变量注入 |
| 样式 | Tailwind CSS 3 + `src/index.css` 中的设计 token |
| 路由 | React Router 6，**必须使用 HashRouter** |
| Markdown | react-markdown + remark-gfm + rehype-slug + rehype-highlight |
| 图标 | 内联 SVG（`components/Icon.tsx`），不引入图标库 |
| 部署 | GitHub Pages（静态产物，无服务端） |

### 2.1 不要引入

- UI 组件库（Ant Design / MUI / shadcn 等）
- CSS-in-JS 运行时（styled-components / emotion）
- 图表库、动画库（framer-motion 等）
- 任何后端、数据库、鉴权方案
- 第三方统计与追踪脚本

需要新依赖时，先确认「用现有能力能否实现」，再说明体积代价。

## 三、目录结构与职责

```text
src/
├── components/    # 可复用 UI，不含业务数据
├── pages/         # 路由级页面，负责组合组件与数据
├── content/       # 全部内容数据（唯一数据源）
├── lib/           # 纯函数工具（markdown 解析等）
└── hooks/         # 自定义 hook
```

约定：

- **组件不直接 import 内容文件**，由页面读取数据后通过 props 传入
- `lib/` 中的函数必须是无副作用的纯函数
- 新增页面时，在 `App.tsx` 注册路由，并在 `Navbar` 中判断是否需要入口

## 四、代码规范

1. 只用函数组件 + Hooks，不写 class 组件
2. TypeScript 严格模式：禁止 `any`，必要时用 `unknown` + 类型收窄
3. 组件文件使用 PascalCase（`ProjectCard.tsx`），工具文件使用 camelCase
4. Props 使用 `interface XxxProps` 定义，导出默认组件
5. 事件处理函数命名 `handleXxx`，传参回调命名 `onXxx`
6. 一个组件超过 200 行时，考虑拆分
7. 导入顺序：React → 第三方 → 项目内部（`@/` 未配置别名，使用相对路径）
8. 注释只解释「为什么」，不复述代码

### 4.1 类型示例

```ts
interface ProjectCardProps {
  project: Project
  onOpen?: (slug: string) => void
}
```

## 五、样式规范

- 优先使用 Tailwind 工具类；重复三次以上的组合抽成 `@layer components`
- 颜色只用 `tailwind.config.js` 中的 token（`ink-*` / `mist` / `muted` / `accent*`），禁止写死十六进制（`index.css` 中的主题定义除外）
- 间距使用 4px 基准（`gap-2` / `p-6` / `mt-10`）
- 圆角卡片统一 `rounded-2xl`，按钮 `rounded-full`
- 动效统一 `transition-all duration-300`，入场动画使用 `Reveal` 组件
- 任何动画都必须考虑 `prefers-reduced-motion`

## 六、内容维护

### 6.1 新增博客文章

1. 在 `src/content/posts/` 新建 `kebab-case.md`
2. 必须包含 frontmatter：

```md
---
title: 文章标题
date: 2026-02-01
tags: [标签一, 标签二]
summary: 一句话摘要，会显示在列表页
---
```

3. 正文从 `##` 开始写，`###` 会进入目录
4. 不需要手动注册，构建时自动收集

### 6.2 新增项目

在 `src/content/projects.ts` 的 `projects` 数组追加对象：

- `slug` 唯一，用作路由
- `cover` 从预设图案中选：`grid` / `orbit` / `wave` / `circuit`
- `description` 使用 Markdown，支持代码块与表格
- `links` 只放真实可访问的地址

### 6.3 修改个人信息

只改 `src/content/profile.ts`。邮箱、GitHub、状态、时间线都在这里，全站引用会自动更新。

## 七、质量要求与自测清单

每次改动后至少验证：

- [ ] `npm run build` 通过，无 TypeScript 报错
- [ ] 375px / 768px / 1440px 三个宽度无横向滚动
- [ ] 所有路由可直达（含刷新），404 页面正常
- [ ] 键盘 Tab 能走完导航与表单，焦点可见
- [ ] 关闭系统动效后，内容仍然完整可见
- [ ] 新增文章后，列表、标签、阅读时长、目录全部正确
- [ ] 控制台无报错、无未使用变量警告

## 八、禁止事项

- 禁止把真实密钥、Token、手机号写进仓库或截图
- 禁止在组件中直接写死大段中文文案（应放到 `content/`）
- 禁止使用 `dangerouslySetInnerHTML` 渲染 Markdown
- 禁止为了「看起来高级」引入重型依赖或复杂动画
- 禁止修改 `PRD.md` 中的验收标准来「让测试通过」

## 九、常用命令

```bash
npm install          # 安装依赖
npm run dev          # 本地开发（默认 5173）
npm run build        # 类型检查 + 构建
npm run preview      # 预览构建产物
```

部署：`VITE_BASE=/personal-site/ npm run build`，产物目录 `dist/`。

## 十、协作约定

- 一次只做一件事，改完立即验证
- 修改涉及视觉时，附上截图或说明差异
- 不确定需求时先问，不要自行扩大范围
- 提交信息使用 `type(scope): summary`，如 `feat(blog): 增加标签筛选`
