# Tony 的个人主页

> 一个历史老师的数字世界。  
> 线上地址：https://www.muwentao.com

## 简介

为 Tony 搭建的高级个人主页网站，以 3D 夜景地球为核心视觉，展示旅行记录、个人项目和想法。不是简历页，而是一个有个人温度的数字空间入口。

## 技术栈

- React 19 + Vite 8
- Tailwind CSS v4（Vite 插件方案）
- Three.js + React Three Fiber（3D 夜景地球）
- React Router（多路由 SPA）
- Leaflet + React-Leaflet（旅行地图）

## 页面

- **首页 `/`** — 3D 地球背景 + 个人介绍 + 旅行照片墙 + 项目展示 + 联系方式
- **旅行地图 `/travel`** — Leaflet 交互地图 + 旅行档案卡片

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:5173/`。

## 构建

```bash
npm run build
```

## 部署

项目通过 Vercel 自动部署，推送至 `main` 分支后自动构建上线。
