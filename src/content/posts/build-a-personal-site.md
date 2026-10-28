---
title: 从 0 到 1 做个人网站：我的 AI 协作流程
date: 2026-01-12
tags: [AI 协作, 工程流程, React]
summary: PRD、技术设计、AGENTS.md 三份文档，加上先跑通再打磨的迭代节奏，是我把想法做成可交付产品的固定流程。
---

## 为什么不是「直接让 AI 写」

最开始我也试过一句话让 AI 生成整个网站：`帮我做一个深色系个人网站`。结果能出东西，但每个细节都不是我想要的，改起来像在猜谜。

问题不在模型，在**输入**。需求没说清楚，AI 只能按最平庸的默认值发挥。后来我把流程固定下来：先写文档，再写代码。

## 三步：需求 → 设计 → 约定

### 1. PRD：先想清楚做什么

PRD 不需要长，但要能回答四个问题：

- 给谁看？（招聘方、同学、还是自己）
- 有哪些模块？（首页、关于、技能、项目、博客、联系）
- 哪些必须做？（MVP 范围）
- 做成什么样？（深色、星空、响应式）

我的第一版 PRD 只有一页，但把「不做」也写清楚了：不做后台、不做评论、不做多语言。范围一收，后面所有决策都变简单。

### 2. TECH_DESIGN：把技术选择写死

技术选型最怕「边写边换」。文档里定下来：

- React 18 + TypeScript + Vite
- Tailwind CSS 管样式
- 博客用 Markdown 文件，构建时打包进来
- 部署到 GitHub Pages，纯静态

写下来还有一个好处：AI 每次动手前都能读到同一份约定，不会今天用 CSS Modules、明天用 styled-components。

### 3. AGENTS.md：给 AI 的项目说明书

这是我觉得最值的一份文档。它告诉 AI：

- 项目是什么、怎么跑起来
- 目录结构、命名规则
- 代码风格（函数式组件、类型优先、不引重型依赖）
- 验收标准（375px 不横向滚动、对比度达标）

有了它，我不需要每次重复「请用 TypeScript」「请不要用 any」。

## 实现顺序：先骨架，再血肉

1. **跑通骨架**：路由、布局、导航、页脚，先把空白页面点得通
2. **补核心模块**：首页 → 项目 → 博客 → 联系，按重要程度来
3. **打磨细节**：动画、空状态、移动端、无障碍

每完成一块就提交一次 Git，出问题能立刻回退。这个过程里 AI 是「执行者」，决策仍然在我手里。

## 星空背景的实现

这是整个网站唯一「炫技」的地方，但实现很克制：一块固定定位的 canvas，几百个带相位的星点，用 `requestAnimationFrame` 做闪烁和轻微视差。

```ts
function frame(t: number) {
  ctx.clearRect(0, 0, w, h)
  for (const star of stars) {
    const alpha = 0.35 + 0.35 * Math.sin(t * star.speed + star.phase)
    ctx.globalAlpha = alpha
    ctx.fillStyle = star.color
    ctx.beginPath()
    ctx.arc(star.x, star.y + offset * star.depth, star.r, 0, Math.PI * 2)
    ctx.fill()
  }
  requestAnimationFrame(frame)
}
```

三个约束：

- 移动端减少粒子数量
- `prefers-reduced-motion` 时只画静态星空
- 页面不可见时暂停动画

## 部署

GitHub Pages 是最省事的选择：仓库开启 Pages，构建产物推到对应分支，域名就是 `用户名.github.io/仓库名/`。

唯一要处理的是**子路径**：Vite 的 `base` 要设成 `/仓库名/`，路由用 Hash 模式，否则刷新 404。

## 回头看

这套流程最大的价值不是「更快」，而是**可复现**。下一次做新项目，我不用重新摸索，照着文档走一遍就行。

如果你也在用 AI 写项目，建议先花半天写这三份文档——后面能省下的时间远不止半天。
