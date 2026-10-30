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
  /** 本地运行的应用：详情页展示运行方式，不提供线上入口 */
  localApp?: boolean
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
    title: 'MiniMind · 本地 AI 对话模型',
    subtitle: '64M 小模型的 SFT + LoRA 微调，以及一个带记忆的对话应用',
    year: '2026',
    category: 'ai',
    tags: ['Python', 'PyTorch', 'SFT', 'LoRA'],
    featured: true,
    summary:
      '把课程里分散的语料合成一份、重新训出单文件权重，再配一个会记住上文、能切换本地/远端模型的网页对话应用。',
    cover: { from: '#a78bfa', to: '#6366f1', pattern: 'orbit', mark: 'AI' },
    highlights: [
      '数据 272 → 323 条：统一 system 消息、补 31 条多轮、补「承认不知道」和陈述句回应',
      '全参 SFT 5 epoch + LoRA（r=16）2 epoch，合并成 131MB 单文件，推理零额外开销',
      '固定题集评测：关键词命中 8/10 → 10/10，复读分 0.3 → 0.0',
      '配套应用：多轮上下文 + 摘要压缩、本地/多个远端一键切换、账号登录与数据隔离',
    ],
    links: [],
    localApp: true,
    description: `## 背景

课程给了三份东西：SFT 的数据格式、LoRA 的注入与合并、以及一份孙悟空语料。原来的做法是「三份数据各训一个权重」，成品只能选一个用。
这次想做完整：**合成一份数据、按 SFT → LoRA → 合并的顺序训出单文件权重，再配一个真的能用的对话界面。**

## 数据：把三份合成一份

原数据 272 条（通用 78 + 自我认知 39 + 孙悟空 155），全是单轮、没有 system。改造做了四件事：

1. **统一加 system**：通用数据用「你是一个中文 AI 助手。」，语料用「你现在扮演孙悟空」——同一个权重既能当助手也能演角色，身份不互相污染
2. **补多轮** 31 条：教它「接着上文说」，比如先记住「我叫小林，做前端」，再问「我刚才说我做什么的」
3. **补边界样本**：8 条「不知道就说不知道」，12 条陈述句回应（用户多半在陈述，不是在提问）
4. 去重后共 323 条，平均 188 字符

## 训练：SFT 5 epoch，再叠 LoRA

\`\`\`powershell
python trainer_sft.py --data_path ./dataset/sft_all.jsonl --save_weight chat_full --epochs 5 --learning_rate 5e-5 --batch_size 8
python trainer_lora.py --data_path ./dataset/sft_all.jsonl --from_weight chat_full --lora_name lora_chat --lora_rank 16 --epochs 2
python tools/merge_lora.py --base out/chat_full.pth --lora out/lora_chat.pth --out out/chat.pth
\`\`\`

合并就是 \`W ← W + B·A\`，之后推理完全不需要 LoRA 分支。合并结果和「基座 + LoRA」的 logits 最大差 6.3e-3，只是 fp16 存储误差。

## 踩过的三个坑

**1. CPU 上 batch=16 会原生崩溃。** 进程以 \`0xC0000005\`（access violation）退出，没有 Python 异常，栈顶停在 \`cross_entropy\`。二分定位后发现是 Windows + 这份 CPU 版 torch 在大张量多线程下的问题：batch 16 + 24 线程必崩，batch 8 或 8 线程都正常。最后固定 \`batch_size=8\` + \`OMP_NUM_THREADS=8\`。

**2. 中文被 token 边界切开。** 一个汉字跨两个 token 时，前半截会被解码成替换字符，页面上就是乱码方块。改成累积 token id 再整体解码、尾部残缺字符先扣住不发。

**3. 小模型采样必翻车。** temperature 0.85 时「我叫小林」能答出一段英文。改成贪心解码，并把训练时那句短 system 固定下来，回答才稳定。

## 结果

用 14 题固定题集、贪心解码做的对比（同一套 prompt，可复现）：

| 指标 | 旧权重 | 新权重 |
| --- | --- | --- |
| 关键词命中 | 8/10 | **10/10** |
| 平均复读分 | 0.3 | **0.0** |
| 多轮追问「我刚才说我做什么的」 | 答成「小林先说一点点…」 | **「你说你是做前端开发的。」** |
| 「你叫什么名字」 | 「我叫通义千问」 | **「我叫 MiniMind，你也可以叫我小敏。」** |
| 角色扮演（system 指定） | 语义崩坏 | **「里面没有水，是一个安身的好地方…」** |

## 应用层

权重只是半成品，所以又写了一个网页对话应用（纯 Python 标准库 + 原生前端）：

- **记忆**：每次带最近 6 轮原文；超出的旧对话压缩成摘要常驻 system，滚动更新
- **多引擎**：本地 64M 与多个远端接口（DeepSeek / Moonshot / Ollama）一键切换，Key 各自保存
- **账号**：注册 / 改用户名 / 改密码 / 退出，会话按账号隔离，口令用 PBKDF2 加盐存储

## 怎么运行

\`\`\`powershell
cd ai-chat
python server.py
\`\`\`

打开 http://127.0.0.1:8765 就能聊：没有 API Key 时默认用本地 miniMind（会自动找 \`../minimind-vscode/.venv\` 里的解释器），
在右上角设置里可以随时切到 DeepSeek / Moonshot / Ollama 等 OpenAI 兼容端点。

## 反思

64M 的参数是硬上限：题目问法贴近训练数据时很稳，稍微换个说法就退化。这次真正学到的不是「怎么调 loss」，而是
**数据里没有的能力，靠训练技巧补不回来**——想要通用能力，只能换更大的底座或接远端模型。`,
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
