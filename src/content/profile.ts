export interface Stats {
  label: string
  value: string
}

export interface TimelineItem {
  period: string
  title: string
  desc: string
}

export interface Profile {
  name: string
  initials: string
  logo: string
  school: string
  role: string
  status: string
  tagline: string
  intro: string[]
  location: string
  email: string
  github: string
  githubName: string
  focus: string[]
  stats: Stats[]
  timeline: TimelineItem[]
  principles: { title: string; desc: string }[]
}

export const profile: Profile = {
  name: '豆杰晟',
  initials: 'DJ',
  logo: '豆',
  school: '大连民族大学',
  role: '物联网工程 · 2024 级本科生',
  status: '在读 · 寻找 2026 暑期实习',
  tagline:
    '我喜欢把想法做成能跑起来的东西：从网页、浏览器扩展，到单片机和小传感器，也想把 AI 塞进日常的小工具里。',
  intro: [
    '你好，我是豆杰晟，大连民族大学物联网工程专业 2024 级本科生。我的兴趣横跨「软件」和「硬件」：一边写前端页面、做浏览器扩展，一边折腾单片机和传感器。',
    '我偏爱「先跑通，再打磨」的做法：先用最小可用版本验证想法，再一点点补上细节。这个网站本身也是这么来的——先写清楚 PRD 和技术设计，再让 AI 和我一起把它实现出来。',
    '写代码之外，我喜欢把踩过的坑整理成博客。如果这些记录能帮到下一个遇到同样问题的人，那就再好不过了。',
  ],
  location: '辽宁 · 大连',
  email: '3239296201@qq.com',
  github: 'https://github.com/Sc30289',
  githubName: 'Sc30289',
  focus: ['前端工程', '物联网应用', 'AI 应用'],
  stats: [
    { label: '项目', value: '4' },
    { label: '博客', value: '4' },
    { label: '技术方向', value: '3' },
    { label: '好奇心', value: '∞' },
  ],
  timeline: [
    {
      period: '2024.09',
      title: '进入大连民族大学，读物联网工程',
      desc: '从 C 语言和电路基础起步，第一次体会到「程序真的会按你写的跑」。',
    },
    {
      period: '2024.12',
      title: '第一个真正上线的网页',
      desc: 'HTML / CSS / JavaScript 三件套，把课程作业做成了一个可以分享的页面。',
    },
    {
      period: '2025.03',
      title: '转向 React + TypeScript',
      desc: '开始用组件化和类型系统写项目，也第一次认真读官方文档。',
    },
    {
      period: '2025.06',
      title: 'ImageGrab：一个 Chrome 扩展',
      desc: '用 Manifest V3 做电商图片批量提取，学会了权限、跨域与 Canvas 转换。',
    },
    {
      period: '2025.11',
      title: '天气查询与 AI 小实验',
      desc: '用 React + Open-Meteo 做零成本天气应用，同时开始接触 LoRA 微调。',
    },
    {
      period: '2026.01',
      title: '这个个人网站',
      desc: '按 PRD → 技术设计 → AGENTS.md → 实现的流程，从 0 到 1 做完并部署上线。',
    },
  ],
  principles: [
    {
      title: '先跑通，再打磨',
      desc: 'MVP 先验证核心流程，细节留到第二遍。避免在错误的方向上精雕细琢。',
    },
    {
      title: '文档先于代码',
      desc: '把需求、技术选型和约定写下来，人和 AI 都少走弯路。',
    },
    {
      title: '性能是体验的一部分',
      desc: '首屏、动画、图片都要克制：能少一个依赖就少一个。',
    },
    {
      title: '记录，然后分享',
      desc: '踩过的坑写成博客，下一次遇到时就不用再翻聊天记录。',
    },
  ],
}
