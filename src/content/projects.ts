export type CoverPattern = 'grid' | 'orbit' | 'wave' | 'circuit' | 'stamp'

export interface ProjectLink {
  label: string
  href: string
  kind: 'github' | 'demo' | 'doc'
}

export interface Project {
  slug: string
  title: string
  subtitle: string
  year: string
  category: 'web' | 'ext' | 'ai' | 'embedded'
  tags: string[]
  summary: string
  cover: { from: string; to: string; pattern: CoverPattern; mark: string }
  highlights: string[]
  links: ProjectLink[]
  description: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'watermark',
    title: '图片水印助手',
    subtitle: '用秒哒零代码平台做的批量加水印工具',
    year: '2026',
    category: 'web',
    tags: ['零代码', '秒哒', 'Canvas'],
    summary:
      '上传图片、加文字或图片水印，支持四角 / 居中定位、全屏平铺、透明度与角度调节，实时预览后一键下载。',
    cover: { from: '#22d3ee', to: '#0284c7', pattern: 'stamp', mark: 'WM' },
    featured: true,
    highlights: [
      '百度秒哒生成：自然语言描述需求，直接出可用页面',
      '文字 / 图片两种水印，四角、居中或全屏平铺',
      '透明度、角度、边距可调，防搬运的同时不挡主体',
      'Canvas 实时预览，按原图分辨率导出',
    ],
    links: [
      { label: '在线体验', href: 'https://app-fcri6lx0tqm9.miaoda.online', kind: 'demo' },
    ],
    description: `## 需求来自真实场景

做电商和自媒体的同学，图片经常被搬运，加个水印是最直接的防护。但用 PS 一张张处理太慢，于是想做一个「上传 → 调参数 → 下载」的小工具。

## 用秒哒零代码搭出来

在百度秒哒里用自然语言描述需求，平台直接生成了可用的页面：

- 上传图片（支持多张）
- 文字水印：内容、字号、颜色
- 图片水印：上传 logo 作为水印
- 位置：四个角、居中，或全屏平铺
- 参数：透明度、旋转角度、边距
- 实时预览 + 一键下载

## 实现要点

预览和导出都走 Canvas：先把原图画到画布上，再按参数叠加水印文字或图片，最后 \`toBlob\` 导出 PNG，保证输出是原图分辨率而不是缩略图。

\`\`\`js
const canvas = document.createElement('canvas')
canvas.width = img.naturalWidth
canvas.height = img.naturalHeight
const ctx = canvas.getContext('2d')
ctx.drawImage(img, 0, 0)
ctx.globalAlpha = opacity
ctx.drawImage(logo, x, y, w, h) // 或 fillText
canvas.toBlob((blob) => download(blob), 'image/png')
\`\`\`

## 局限与后续

- 纯前端处理，图片不上传服务器，隐私友好
- 批量处理多张时受浏览器内存限制
- 后续想加：水印模板保存、批量重命名、EXIF 保留

## 收获

零代码平台把「想法 → 可用产品」的路径压缩到几十分钟，很适合验证需求；当交互变复杂时，还是需要自己写代码——这也是我后来做 ImageGrab 的原因。`,
  },
  {
    slug: 'imagegrab',
    title: '图提取 · ImageGrab',
    subtitle: '一键提取电商详情页图片的 Chrome 扩展',
    year: '2025',
    category: 'ext',
    tags: ['Chrome MV3', 'JavaScript', 'Canvas'],
    featured: true,
    summary:
      '在淘宝 / 京东 / 拼多多商家版详情页右下角注入按钮，一次点击提取全部商品图，勾选后批量下载为 PNG。',
    cover: { from: '#0ea5e9', to: '#6366f1', pattern: 'grid', mark: 'IG' },
    highlights: [
      'Manifest V3 + Service Worker，悬浮按钮与预览页分离',
      'OffscreenCanvas 统一转 PNG，解决 WebP / AVIF 兼容',
      '图片地址归一与去重，自动还原 CDN 缩略图为原图',
      '批量下载带进度与失败清单，纯本地运行不上传数据',
    ],
    links: [
      { label: '源码仓库', href: 'https://github.com/Sc30289/imagegrab', kind: 'github' },
      { label: '在线官网', href: 'https://sc30289.github.io/imagegrab/', kind: 'demo' },
    ],
    description: `## 为什么做它

做电商运营和设计的同学，采集竞品图片时基本只有一条路：右键、另存为、改格式、再一张张重命名。详情页动辄三五十张图，还夹着图标、logo 和懒加载占位图。

ImageGrab 把这件事压缩成三步：打开详情页 → 点「获取图片」→ 勾选后下载。

## 技术要点

### 1. 内容脚本只做「收集」

\`content.js\` 负责扫描页面，把 \`<img>\`、\`srcset\`、\`data-src\`、\`data-original\` 以及 \`background-image\` 里的地址收集起来，再做一轮过滤：

- 宽或高小于 100px 的图直接丢弃（图标、角标）
- 去掉 1×1 像素与占位图
- 按规范化后的 URL 去重
- 识别 CDN 的缩放后缀（如 \`_50x50.jpg\`），还原成原图地址

### 2. Service Worker 负责「转换」

跨域图片在页面里读进 Canvas 会污染画布，扩展里则可以在 Service Worker 中用 \`fetch\` + \`OffscreenCanvas\` 完成转换：

\`\`\`js
async function toPng(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  const bitmap = await createImageBitmap(blob)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  canvas.getContext('2d').drawImage(bitmap, 0, 0)
  return canvas.convertToBlob({ type: 'image/png' })
}
\`\`\`

### 3. 预览页只做「勾选」

结果页是一个普通的 HTML 页面：网格展示、全选 / 反选、实时计数、原图查看。下载时把选中的地址发回 Service Worker，由它按队列串行处理，避免并发过高把内存打满。

## 踩过的坑

| 问题 | 原因 | 解决 |
| --- | --- | --- |
| 扩展按钮被页面样式污染 | 电商站点全局 CSS 很激进 | 所有类名加 \`igx-\` 前缀 + Shadow DOM 隔离 |
| 懒加载图抓不到 | 图片要滚动才挂载 | 读取 \`data-*\` 属性，必要时自动滚动触发二次扫描 |
| WebP 下载后打不开 | 部分系统预览不支持 | 统一走 Canvas 转 PNG |
| 下载数量一多就卡死 | 并发 fetch 过多 | 队列 + 并发上限 3 |

## 学到的东西

扩展开发和普通网页最大的区别是**运行环境会被拆开**：页面、后台、预览页各跑各的，状态要靠消息传递同步。想清楚「谁负责什么」比写多少代码都重要。`,
  },
  {
    slug: 'weather-app',
    title: '天气查询',
    subtitle: '零成本的天气应用',
    year: '2025',
    category: 'web',
    tags: ['React', 'Vite', 'Open-Meteo'],
    summary:
      '中英文城市搜索、当前天气与未来三天预报，数据全部来自免费的 Open-Meteo 接口，不需要任何 API Key。',
    cover: { from: '#38bdf8', to: '#22d3ee', pattern: 'wave', mark: 'WX' },
    highlights: [
      'Open-Meteo 双接口：地理编码 + 天气数据，无需注册',
      'localStorage 记录最近 5 次查询，一键切换城市',
      '完整的中文错误提示与加载骨架屏',
      '移动端单列布局，输入框自动聚焦',
    ],
    links: [{ label: '在线体验', href: 'https://extraordinary-ganache-e4cf1a.netlify.app', kind: 'demo' }],
    description: `## 目标

做一个「打开就能用」的天气查询：输入城市，看到现在和未来三天，不需要注册、不需要 Key、不依赖付费服务。

## 接口设计

Open-Meteo 提供了两个免费接口，组合起来刚好够用：

1. **地理编码**：\`geocoding-api.open-meteo.com/v1/search?name=杭州&language=zh\`
2. **天气数据**：\`api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,weather_code\`

两个接口都不需要鉴权，返回 JSON。缺点是天气现象是数值编码（WMO code），需要自己维护一张映射表：

\`\`\`ts
const WEATHER_TEXT: Record<number, string> = {
  0: '晴',
  1: '大部晴朗',
  2: '局部多云',
  3: '阴',
  45: '雾',
  61: '小雨',
  63: '中雨',
  95: '雷阵雨',
}
\`\`\`

## 状态管理

页面只有四个状态：\`idle\`、\`loading\`、\`success\`、\`error\`。用 \`useReducer\` 收敛，比散落的布尔值好维护：

\`\`\`ts
type State =
  | { status: 'idle' }
  | { status: 'loading'; city: string }
  | { status: 'success'; data: WeatherBundle }
  | { status: 'error'; message: string }
\`\`\`

## 一点细节

- 输入中文或英文城市名都能搜到，靠的是地理编码接口的 \`language\` 参数
- 最近查询存 localStorage，最多保留 5 条，超出后淘汰最旧的
- 请求失败时给出「城市没找到 / 网络异常」两类提示，而不是统一的「出错了」

## 部署

Vite 构建后直接丢给 Netlify，构建命令 \`npm run build\`，产物目录 \`dist\`。整个项目没有后端，成本为零。`,
  },
  {
    slug: 'minimind-lora',
    title: 'MiniMind · AI 对话模型',
    subtitle: '小模型的 SFT 与 LoRA 微调实验',
    year: '2025',
    category: 'ai',
    tags: ['Python', 'PyTorch', 'LoRA'],
    featured: true,
    summary:
      '在开源小模型上跑通 SFT 与 LoRA 微调：数据清洗、训练脚本、显存优化，以及一轮完整的效果对比。',
    cover: { from: '#a78bfa', to: '#6366f1', pattern: 'orbit', mark: 'AI' },
    highlights: [
      '从零跑通 SFT 流程：数据格式、tokenizer、训练循环',
      'LoRA 只训练少量参数，单卡显存占用明显下降',
      '固定随机种子 + 同一批测试问题做前后对比',
      '把踩过的坑整理成可复用的训练清单',
    ],
    links: [{ label: '训练脚本', href: 'https://github.com/Sc30289', kind: 'github' }],
    description: `## 背景

大模型很贵，小模型很便宜。我想知道：一个几千万参数的小模型，经过一轮 LoRA 微调，能不能在特定任务上变得「像样」一点。

## 流程

1. **数据**：把问答整理成 \`{"instruction": ..., "output": ...}\` 的 JSONL，去掉重复和过短的样本
2. **训练**：冻结主干，只给注意力层的线性投影加 LoRA 适配器
3. **评估**：固定 20 个测试问题，微调前后各跑一遍，人工对比

\`\`\`python
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, config)
model.print_trainable_parameters()
\`\`\`

## 结果与反思

- 任务内的回答明显更贴题，但模型的通用能力会有一点下降
- 学习率比数据量更敏感：\`2e-4\` 时很快就过拟合
- 评估必须固定问题集，否则很容易「感觉变好了」

## 最大的收获

微调不是魔法。数据质量、评估方式、训练稳定性，任何一环偷懒，结果都会骗人。`,
  },
]

export const projectCategories = [
  { key: 'all', label: '全部' },
  { key: 'web', label: '前端' },
  { key: 'ext', label: '扩展' },
  { key: 'ai', label: 'AI' },
  { key: 'embedded', label: '嵌入式' },
] as const

export const featuredProjects = projects.filter((project) => project.featured)
export const otherProjects = projects.filter((project) => !project.featured)
