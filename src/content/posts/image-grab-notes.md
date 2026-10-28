---
title: 用 Manifest V3 做一个电商图片提取插件
date: 2025-06-18
tags: [Chrome 扩展, JavaScript, Canvas]
summary: 从悬浮按钮到批量下载，聊聊 MV3 里内容脚本、Service Worker 和预览页怎么配合，以及跨域、懒加载这些坑怎么绕过去。
---

## 起因

做电商的朋友每天都要从详情页把商品图存下来：右键、另存为、改格式、重命名。几十张图下来，半小时就没了，还经常漏掉懒加载的图片。

于是我写了 **ImageGrab**：详情页右下角一个按钮，点一下，全部图片进预览页，勾选后批量下载成 PNG。

## MV3 的三个角色

Manifest V3 把扩展拆成了几个互不相通的世界，必须先想清楚分工：

| 角色 | 文件 | 职责 |
| --- | --- | --- |
| 内容脚本 | `content.js` | 注入按钮、扫描页面图片 |
| Service Worker | `background.js` | 打开预览页、下载与格式转换 |
| 预览页 | `gallery.html` | 展示、勾选、发起下载 |

页面和后台之间只能靠消息通信，所以每个动作都要定义清楚「谁发起、谁处理、谁回传」。

## 提取：比想象中麻烦

最直接的想法是 `document.querySelectorAll('img')`，但真实页面里：

- 图片地址可能在 `src`、`data-src`、`data-original`、`srcset` 里
- 商品图可能是 `background-image`
- 一堆 1×1 像素的埋点和占位图
- CDN 返回的是缩略图，比如 `xxx_50x50.jpg`

所以扫描之后还要做过滤和归一化：

```js
const MIN_SIZE = 100

function normalize(url) {
  const abs = new URL(url, location.href).href
  // 去掉淘宝/京东的缩放后缀，拿回原图
  return abs.replace(/_\d+x\d+\.(jpg|png|webp)$/i, '')
}

function collect() {
  const urls = new Set()
  for (const img of document.images) {
    const raw = img.dataset.src || img.dataset.original || img.currentSrc || img.src
    if (!raw) continue
    if (img.naturalWidth && Math.min(img.naturalWidth, img.naturalHeight) < MIN_SIZE) continue
    urls.add(normalize(raw))
  }
  return [...urls]
}
```

## 转换：跨域图片怎么办

预览页是扩展自己的页面，直接 fetch 电商 CDN 的图片会被跨域拦住；就算拿到了，画进 Canvas 也会污染画布，`toBlob` 直接报错。

MV3 的解法是把这件事放到 Service Worker 里，配合 `host_permissions`，再用 `OffscreenCanvas`：

```js
async function fetchAsPng(url) {
  const res = await fetch(url, { credentials: 'omit' })
  const bitmap = await createImageBitmap(await res.blob())
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  canvas.getContext('2d').drawImage(bitmap, 0, 0)
  return canvas.convertToBlob({ type: 'image/png' })
}
```

这样 WebP、AVIF 都能统一成 PNG，用户下载下来直接能用。

## 下载：别一次全发出去

第一版我让预览页把选中的地址一次性 `postMessage` 给后台，结果 40 张图直接把内存打满，页面卡死。

改成队列 + 并发上限 3 之后稳定了：

```js
async function runQueue(items, worker, limit = 3) {
  const queue = [...items]
  const runners = Array.from({ length: limit }, async () => {
    while (queue.length) {
      const item = queue.shift()
      await worker(item)
    }
  })
  await Promise.all(runners)
}
```

进度和失败清单通过消息实时回传，用户可以只重试失败的那几张。

## 几个小坑

- **样式污染**：电商站点的全局 CSS 很凶，按钮必须加前缀（我用 `igx-`），必要时上 Shadow DOM
- **懒加载**：图片要滚动才挂载，所以先读 `data-*`，扫不到再自动滚动触发一轮
- **文件名**：按 `商品图_001.png` 补零，下载下来排序不会乱
- **权限**：只申请必要的域名，商店审核会看

## 回头看

扩展开发和普通网页最大的区别是**运行环境被拆开了**。写代码之前先把「谁负责什么」画清楚，后面会省掉一大半调试时间。

项目开源在 [GitHub](https://github.com/Sc30289/imagegrab)，官网在 [这里](https://sc30289.github.io/imagegrab/)。
