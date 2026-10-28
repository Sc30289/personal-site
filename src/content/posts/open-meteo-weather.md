---
title: React 天气应用：零成本接入 Open-Meteo
date: 2025-11-09
tags: [React, Vite, API]
summary: 不注册、不付费、不需要 API Key，用两个免费接口做完整的天气查询：地理编码、天气数据、错误处理和查询历史。
---

## 为什么选 Open-Meteo

做天气应用最大的门槛其实不是界面，是数据源。大部分天气 API 都要注册、拿 Key、算调用量，免费额度还随时会变。

[Open-Meteo](https://open-meteo.com/) 的好处很直接：**不用注册，不用 Key，非商业用途免费**。它提供两个接口，组合起来刚好够做一个完整的查询页：

- 地理编码：`geocoding-api.open-meteo.com/v1/search`
- 天气数据：`api.open-meteo.com/v1/forecast`

## 第一步：把城市名变成坐标

用户输入的是「杭州」或者 `Hangzhou`，天气接口要的是经纬度，所以先查地理编码：

```ts
const geo = await fetch(
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`,
).then((r) => r.json())

if (!geo.results?.length) throw new Error('城市没找到')
const { latitude, longitude, name, country } = geo.results[0]
```

`language=zh` 能让返回的城市名直接是中文，省掉一层翻译。

## 第二步：拿天气

天气接口一次可以把当前天气和未来几天一起要回来，参数写好 `current` 和 `daily`：

```ts
const weather = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`,
).then((r) => r.json())
```

`timezone=auto` 很关键：否则接口按 UTC 返回，国内用户看到的「今天」会差 8 小时。

## 第三步：天气代码要翻译成人话

接口返回的 `weather_code` 是 WMO 编码，比如 `0` 是晴、`61` 是小雨。维护一张映射表就够了：

```ts
const WEATHER: Record<number, { text: string; icon: string }> = {
  0: { text: '晴', icon: '☀️' },
  1: { text: '大部晴朗', icon: '🌤️' },
  2: { text: '局部多云', icon: '⛅' },
  3: { text: '阴', icon: '☁️' },
  45: { text: '雾', icon: '🌫️' },
  61: { text: '小雨', icon: '🌦️' },
  63: { text: '中雨', icon: '🌧️' },
  95: { text: '雷阵雨', icon: '⛈️' },
}

const label = WEATHER[code] ?? { text: '未知', icon: '❔' }
```

## 状态用 useReducer 收敛

页面只有四种状态，散着写布尔值很快就会乱：

```ts
type State =
  | { status: 'idle' }
  | { status: 'loading'; city: string }
  | { status: 'success'; city: string; data: Weather }
  | { status: 'error'; message: string }
```

这样渲染层只要 `switch (state.status)`，加载骨架、错误提示、数据区各管各的。

## 错误提示要具体

第一版所有失败都提示「出错了」，用户根本不知道是城市名打错了还是网络断了。后来拆成三类：

1. 地理编码查不到 → 「没有找到这个城市，换个名字试试」
2. 网络异常 → 「网络好像不太稳定，请稍后重试」
3. 接口返回异常 → 「天气服务暂时不可用」

有具体原因的报错，用户才知道下一步该做什么。

## 查询历史

用 `localStorage` 存最近 5 个城市，键就是一个数组：

```ts
const KEY = 'weather:recent'

function remember(city: string) {
  const list = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  const next = [city, ...list.filter((c) => c !== city)].slice(0, 5)
  localStorage.setItem(KEY, JSON.stringify(next))
}
```

点击历史记录直接重新查询，比每次手打快得多。

## 部署

Vite 构建后是纯静态文件，丢给 Netlify 就行，构建命令 `npm run build`，发布目录 `dist`。没有后端、没有数据库，成本为零。

线上地址：[extraordinary-ganache-e4cf1a.netlify.app](https://extraordinary-ganache-e4cf1a.netlify.app)
