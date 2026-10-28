export interface Skill {
  name: string
  level: number
  note?: string
}

export interface SkillGroup {
  key: string
  title: string
  subtitle: string
  icon: 'code' | 'layers' | 'spark' | 'chip'
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'frontend',
    title: '前端',
    subtitle: '把设计稿变成能用的界面',
    icon: 'code',
    skills: [
      { name: 'React', level: 88, note: 'Hooks / 路由 / 组件设计' },
      { name: 'TypeScript', level: 84, note: '类型收窄、泛型、工程配置' },
      { name: 'HTML / CSS', level: 90, note: '响应式、动画、无障碍' },
      { name: 'Tailwind CSS', level: 85, note: '设计 token 与组件样式' },
    ],
  },
  {
    key: 'engineering',
    title: '工程化',
    subtitle: '让项目可维护、可交付',
    icon: 'layers',
    skills: [
      { name: 'Vite', level: 82, note: '构建、按需加载、子路径部署' },
      { name: 'Git / GitHub', level: 80, note: '分支、提交规范、Pages' },
      { name: '浏览器扩展 MV3', level: 78, note: '权限、Service Worker、消息通信' },
      { name: 'Node.js 脚本', level: 70, note: '自动化构建与截图' },
    ],
  },
  {
    key: 'ai',
    title: 'AI 应用',
    subtitle: '把模型能力接进产品',
    icon: 'spark',
    skills: [
      { name: 'Prompt 工程', level: 80, note: '结构化指令、迭代收敛' },
      { name: 'Python', level: 75, note: '数据处理与实验脚本' },
      { name: 'PyTorch / LoRA', level: 65, note: '小模型微调实践' },
      { name: 'API 集成', level: 72, note: 'Open-Meteo、LLM 接口' },
    ],
  },
  {
    key: 'embedded',
    title: '嵌入式',
    subtitle: '从寄存器到数码管',
    icon: 'chip',
    skills: [
      { name: 'C51 / 单片机', level: 76, note: '定时器、中断、数码管' },
      { name: 'Keil / Proteus', level: 72, note: '工程构建与仿真' },
      { name: '电路基础', level: 68, note: '原理图、驱动电路' },
      { name: '调试与测试', level: 74, note: '逻辑分析、分模块验证' },
    ],
  },
]

export const toolbox = [
  'VS Code',
  'Git',
  'Figma',
  'Postman',
  'Chrome DevTools',
  'Vite',
  'React Router',
  'Markdown',
  'Linux',
  'Figma',
]
