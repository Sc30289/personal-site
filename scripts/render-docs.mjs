/**
 * 把 PRD.md / TECH_DESIGN.md / AGENTS.md 渲染成适合截图存档的 HTML 文档页。
 * 用法：node scripts/render-docs.mjs
 * 输出：../_shots/docs/*.html
 */
import { marked } from 'marked'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outDir = path.resolve(root, '..', '_shots', 'docs')
fs.mkdirSync(outDir, { recursive: true })

const docs = [
  {
    file: 'PRD.md',
    title: '产品需求文档',
    label: '需求文档',
    accent: '#38bdf8',
  },
  {
    file: 'TECH_DESIGN.md',
    title: '技术设计文档',
    label: '技术文档',
    accent: '#818cf8',
  },
  {
    file: 'AGENTS.md',
    title: 'AI 代理协作约定',
    label: 'AGENTS.md',
    accent: '#22d3ee',
  },
]

const css = `
:root {
  --ink: #1f2328;
  --muted: #59636e;
  --line: #d8dee4;
  --soft: #f6f8fa;
  --link: #0969da;
  --code: #0a3069;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  background:
    radial-gradient(circle at 20% 0%, rgba(56,189,248,0.16), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(129,140,248,0.14), transparent 45%),
    #0b0f1a;
  color: var(--ink);
  padding: 44px 20px 60px;
  -webkit-font-smoothing: antialiased;
}
.sheet {
  width: 960px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 40px 120px -40px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06);
  overflow: hidden;
}
.sheet-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 40px;
  background: linear-gradient(180deg, #fbfcfe, #f4f6f9);
  border-bottom: 1px solid var(--line);
}
.dots { display: flex; gap: 6px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; display: block; }
.dots i:nth-child(1) { background: #ff5f57; }
.dots i:nth-child(2) { background: #febc2e; }
.dots i:nth-child(3) { background: #28c840; }
.path { font-family: "Cascadia Code", Consolas, monospace; font-size: 12px; color: var(--muted); }
.path b { color: #1f2328; font-weight: 600; }
.badge {
  margin-left: auto;
  font-size: 11px;
  letter-spacing: .12em;
  padding: 5px 10px;
  border-radius: 999px;
  color: #fff;
  background: var(--accent);
}
.doc {
  padding: 46px 64px 54px;
  font-size: 14.5px;
  line-height: 1.82;
}
.doc > :first-child { margin-top: 0; }
h1, h2, h3, h4 { line-height: 1.35; color: #111418; }
h1 { font-size: 30px; letter-spacing: -0.02em; margin: 0 0 18px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
h2 { font-size: 21px; margin: 38px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
h3 { font-size: 16.5px; margin: 26px 0 10px; }
p { margin: 12px 0; }
a { color: var(--link); text-decoration: none; }
ul, ol { margin: 10px 0; padding-left: 26px; }
li { margin: 5px 0; }
li::marker { color: #8c959f; }
strong { color: #111418; }
hr { border: 0; height: 1px; background: var(--line); margin: 28px 0; }
blockquote {
  margin: 16px 0;
  padding: 10px 18px;
  border-left: 3px solid #cfd8e3;
  background: #f6f8fa;
  color: #57606a;
  border-radius: 0 8px 8px 0;
}
blockquote p { margin: 4px 0; }
code {
  font-family: "Cascadia Code", "JetBrains Mono", Consolas, monospace;
  font-size: 12.8px;
  background: rgba(175,184,193,0.22);
  padding: 2px 6px;
  border-radius: 6px;
  color: var(--code);
}
pre {
  margin: 18px 0;
  padding: 16px 20px;
  background: #f6f8fa;
  border: 1px solid #e4e9ef;
  border-radius: 10px;
  overflow: hidden;
  line-height: 1.65;
}
pre code { background: none; padding: 0; color: #1f2328; font-size: 12.6px; }
table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13.5px; }
th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }
th { background: var(--soft); font-weight: 600; color: #111418; }
tr:nth-child(2n) td { background: #fbfcfd; }
.doc-foot {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 64px; border-top: 1px solid var(--line);
  background: #fbfcfe; font-size: 11.5px; color: var(--muted);
}
.doc-foot b { color: #1f2328; font-weight: 600; }
`

for (const doc of docs) {
  const raw = fs.readFileSync(path.join(root, doc.file), 'utf8')
  const body = marked.parse(raw, { gfm: true, breaks: false })
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>${doc.file} · ${doc.title}</title>
<style>${css.replaceAll('var(--accent)', doc.accent)}</style>
</head>
<body>
<div class="sheet">
  <div class="sheet-head">
    <span class="dots"><i></i><i></i><i></i></span>
    <span class="path">personal-site / <b>${doc.file}</b></span>
    <span class="badge">${doc.label}</span>
  </div>
  <div class="doc">${body}</div>
  <div class="doc-foot">
    <span>豆杰晟 · 个人网站 · <b>${doc.title}</b></span>
    <span>React + TypeScript + Vite · 2026</span>
  </div>
</div>
</body>
</html>`
  const target = path.join(outDir, doc.file.replace('.md', '.html'))
  fs.writeFileSync(target, html, 'utf8')
  console.log('written', target)
}
