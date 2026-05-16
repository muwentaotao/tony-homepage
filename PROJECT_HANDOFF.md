# PROJECT_HANDOFF.md — Tony 个人主页

> 本文档是项目状态记录，每次开发完成后应更新。  
> 最后更新：2026-05-16

---

## 1. 项目名称和项目目标

**项目名称：** tony-homepage

**项目目标：** 为 Tony 搭建一个以 3D 夜景地球为核心视觉的高级个人主页网站。定位是"一个历史老师的数字世界"，展示旅行记录、个人项目和想法。不是简历页，也不是纯程序员作品集，而是一个有个人温度的数字空间入口。

**主要观看对象：** 朋友、同事、学生/家长、网友、陌生访客。

---

## 2. 当前技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | ^19.2.6 | UI 框架 |
| Vite | ^8.0.12 | 构建工具 |
| Tailwind CSS | ^4.3.0 | 样式框架，通过 `@tailwindcss/vite` 插件接入 |
| Three.js | ^0.184.0 | 3D 引擎 |
| @react-three/fiber | ^9.6.1 | React Three.js 渲染器 |
| @react-three/drei | ^10.7.7 | R3F 辅助组件 |
| react-router-dom | ^7.x | 客户端路由（2026-05-16 新增） |
| leaflet | ^1.9.4 | 地图库（2026-05-16 新增） |
| react-leaflet | ^5.x | React Leaflet 封装（2026-05-16 新增） |

**重要：** Tailwind v4 使用 Vite 插件方案，不是 PostCSS 方案。`postcss.config.js` 不存在，不要创建。

---

## 3. 当前运行方式和启动命令

**项目路径：** `/Users/mouwentao/Desktop/vs code/tony-homepage`

**开发启动：**
```bash
cd "tony-homepage"
npm run dev
```

**构建：**
```bash
npm run build
```

**预览构建产物：**
```bash
npm run preview
```

Dev server 默认运行在 `http://localhost:5173/`（如果被占用会自动切换端口）。

**访问地址：**
- 首页：`http://localhost:5173/`
- 旅行地图页：`http://localhost:5173/travel`
- 线上地址：`https://www.muwentao.com` / `https://www.muwentao.com/travel`

---

## 4. 当前页面结构

已从纯单页升级为**多路由 SPA**：

```
[固定层] Earth3D — 3D夜景地球背景（全站fixed，所有路由共用）
[固定层] 全局暗色径向渐变遮罩（z-[1]）
[固定层] Navbar — 顶部导航栏（滚动后出现，z-40）

路由 /（首页）：
  [滚动层] Hero — Tony名字 + 主文案 + 身份标签 + 向下箭头
  [滚动层] AboutCard — 关于我横向卡片（id="about"）
  [滚动层] EntryCards — 4张入口卡片（「我去过的地方」链接到 /travel）
  [滚动层] TravelGallery — 旅行照片墙（id="travel"）
  [滚动层] ThingsBuilt — 项目展示（id="built"）
  [滚动层] Contact — 联系区（id="contact"）
  [滚动层] Footer — 页脚

路由 /travel（旅行地图页）：
  [滚动层] Hero — "Places I've Been" 标题
  [滚动层] 统计徽章 — 3 个 glass-card 数据卡片
  [滚动层] TravelMap — Leaflet 交互地图（CartoDB Dark Matter 底图）
  [滚动层] 旅行档案卡片 — 城市照片 + 一句话记忆
```

---

## 5. 已完成功能

### 第一阶段（项目基础 + 首页骨架 + 全局视觉）
- [x] React + Vite + Tailwind CSS v4 项目搭建
- [x] 深灰黑全局视觉风格（背景 #0a0a0f）
- [x] glass-card 玻璃拟态卡片组件类
- [x] 首页所有区域骨架（Hero / About / EntryCards / Travel / ThingsBuilt / Contact / Footer）

### 第二阶段（3D 夜景地球）
- [x] Three.js + R3F 3D 地球渲染
- [x] 全站 fixed 背景定位
- [x] 地球缓慢自动旋转（约 200 秒一圈）
- [x] 居中显示，scale 1.55（桌面端）/ 1.0（手机端）
- [x] 双贴图模式（白天地形 + 夜景灯光叠加）
- [x] 单贴图 fallback（纯夜景）
- [x] 极淡大气层辉光（#9bb8d0, opacity 0.035）
- [x] 星空背景（桌面端 500 颗 / 手机端 250 颗）
- [x] 贴图清晰度优化（禁用 mipmap、maxAnisotropy、dpr 上限桌面端 2 / 手机端 1.5）
- [x] 按设备加载不同分辨率贴图（桌面端 5120×2560 / 手机端 2048×1024）

### 第三阶段（首页内容完善）
- [x] AboutCard 文案和标签
- [x] EntryCards 4 张入口卡片文案
- [x] Coming Soon 弹窗组件（点击遮罩/×/ESC 关闭）
- [x] TravelGallery 3 张旅行卡片（支持本地图片/占位）
- [x] ThingsBuilt 3 个项目卡片
- [x] Contact 联系区（已替换为真实邮箱和 GitHub）

### 第四阶段（动效 + 响应式 + 导航）
- [x] IntersectionObserver 滚动淡入动画（useScrollReveal hook）
- [x] 玻璃卡片 hover 统一优化（上浮/边框/背景/阴影）
- [x] 手机端响应式适配（所有卡片网格单列、About/Contact 纵向）
- [x] Navbar 导航栏（滚动 >120px 后淡入，玻璃拟态）
- [x] 锚点平滑滚动（About/Travel/Built/Contact）

### 第五阶段（上线前精修）
- [x] 间距统一（EntryCards py 统一）
- [x] SEO 信息更新（title / description / theme-color）
- [x] 生产构建检查通过

### 第六阶段（Vercel 部署）
- [x] GitHub 仓库创建并推送（muwentao/tony-homepage）
- [x] Vercel 网页导入部署成功
- [x] 自定义域名绑定（muwentao.com → www.muwentao.com）

### 第九阶段（3D 地球性能与手机端适配）
- [x] 桌面端贴图升级到 5120×2560（4.3 MB）
- [x] 手机端贴图 2048×1024
- [x] 原图备份（earth-night-original.jpg, 13500×6750）
- [x] Earth3D 按设备加载不同贴图
- [x] 手机端地球缩小（scale 1.0, cameraZ 4.8）
- [x] dpr / 星星数量按设备调整
- [x] 贴图加载前显示占位地球，加载后淡入
- [x] 白天地形贴图 earth-day.jpg（4096×2048）

### 第十阶段（旅行地图子页面）
- [x] 引入 react-router-dom，支持 `/` 和 `/travel` 路由
- [x] 创建 `src/pages/HomePage.jsx` 提取首页内容
- [x] 创建 `src/pages/TravelPage.jsx` 旅行地图页面
- [x] 创建 `src/components/TravelMap.jsx` Leaflet 地图组件
- [x] CartoDB Dark Matter 深色底图，与网站主题一致
- [x] 脉冲光点标记 + 点击弹出城市信息 + flyTo 动画
- [x] 下方旅行档案卡片，hover/click 与地图联动
- [x] EntryCards「我去过的地方」改为真实路由链接
- [x] Navbar 子页面显示 Home 返回链接

---

## 6. 重要文件说明

### 配置文件
| 文件 | 说明 |
|------|------|
| `vite.config.js` | Vite 配置，plugins: [react(), tailwindcss()] |
| `tailwind.config.js` | Tailwind v4 主题配置，定义了 tony-* 颜色体系和动画 |
| `index.html` | 页面入口，lang="zh-CN" |

### 源码文件
| 文件 | 职责 | 状态 |
|------|------|------|
| `src/main.jsx` | React 应用挂载入口，含 BrowserRouter | 稳定 |
| `src/App.jsx` | 根组件，全局背景 + 遮罩 + Navbar + Routes | 稳定 |
| `src/index.css` | 全局样式 + Tailwind + glass-card + Leaflet 自定义样式 | 稳定 |
| `src/pages/HomePage.jsx` | 首页内容组装（Hero/About/Entry/Travel/ThingsBuilt/Contact/Footer） | 稳定 |
| `src/pages/TravelPage.jsx` | 旅行地图页面（Hero/统计/地图/卡片列表） | 近期新增 |
| `src/components/Earth3D.jsx` | **3D 地球核心**。双贴图、自动旋转、淡入。 | **稳定，勿轻易修改** |
| `src/components/TravelMap.jsx` | Leaflet 地图组件。深色底图、脉冲标记、flyTo。 | 近期新增 |
| `src/components/Hero.jsx` | 首屏。Tony 名字 + 主文案 + 身份标签 + 向下箭头。 | 稳定 |
| `src/components/Navbar.jsx` | 顶部导航栏。首页锚点/子页面 Home 返回。 | 近期修改 |
| `src/components/Modal.jsx` | Coming Soon 弹窗。 | 稳定 |
| `src/components/EntryCards.jsx` | 4 张入口卡片。「我去过的地方」链接到 /travel。 | 近期修改 |
| `src/hooks/useScrollReveal.js` | IntersectionObserver hook。 | 稳定 |
| `src/components/AboutCard.jsx` | 关于我卡片。id="about"。 | 稳定 |
| `src/components/TravelGallery.jsx` | 旅行照片墙。id="travel"。3 张卡片。 | 稳定 |
| `src/components/ThingsBuilt.jsx` | 项目展示。id="built"。 | 稳定 |
| `src/components/Contact.jsx` | 联系区。id="contact"。真实邮箱/GitHub。 | 近期修改 |
| `src/components/Footer.jsx` | 页脚版权信息。 | 稳定 |

### 静态资源
| 路径 | 说明 |
|------|------|
| `public/textures/earth-night.jpg` | 夜景地球贴图。桌面端高清版（5120×2560, 4.3 MB） |
| `public/textures/earth-night-mobile.jpg` | 手机端夜景贴图（2048×1024, 186 KB） |
| `public/textures/earth-night-original.jpg` | 原图备份（13500×6750, 7.7 MB） |
| `public/textures/earth-day.jpg` | 白天地形贴图（4096×2048, 1.3 MB） |
| `public/travel/travel-1.jpg` | 旅行照片 1（1200×900, ~1.2 MB） |
| `public/travel/travel-2.jpg` | 旅行照片 2（1200×900, ~1.2 MB） |
| `public/travel/travel-3.jpg` | 旅行照片 3（1200×900, ~910 KB） |

---

## 7. 当前正在开发的阶段

**第十阶段（旅行地图子页面）已完成。已部署到线上。**

---

## 8. 最近一次修改记录

**日期：** 2026-05-16

**修改内容（旅行地图子页面 + Contact 真实信息）：**
- 新增依赖 `react-router-dom`、`leaflet`、`react-leaflet`
- 新增 `src/pages/HomePage.jsx` — 提取原首页内容
- 新增 `src/pages/TravelPage.jsx` — 旅行地图页面（Hero + 统计 + Leaflet 地图 + 旅行档案卡片）
- 新增 `src/components/TravelMap.jsx` — Leaflet 地图组件（CartoDB Dark Matter 底图、脉冲标记、flyTo）
- 修改 `src/App.jsx` — 添加 Routes（/`/travel`）
- 修改 `src/main.jsx` — 引入 BrowserRouter
- 修改 `src/components/Navbar.jsx` — 首页锚点导航 + 子页面 Home 返回链接
- 修改 `src/components/EntryCards.jsx` — 「我去过的地方」改为 `<Link to="/travel">`
- 修改 `src/components/Contact.jsx` — 替换为真实邮箱 `muwentaotao@gmail.com` 和 GitHub `muwentaotao`
- 修改 `src/index.css` — 添加 Leaflet 自定义样式（深色弹出层、脉冲标记动画）
- 新增 `public/textures/earth-day.jpg` — 4096×2048 白天地形贴图

**历史修改：**
- 2026-05-15：第九阶段（地球性能优化）+ TravelGallery 修复
- 更早：项目搭建、3D 地球、首页内容、动效、部署

---

## 9. 当前未完成事项

| 事项 | 优先级 | 说明 |
|------|--------|------|
| EntryCards「关于我」入口 | 中 | 点击仍弹 Coming Soon，但首页已有 AboutCard。建议改为滚动到 `#about` |
| EntryCards「做过的东西」入口 | 中 | 点击仍弹 Coming Soon，但首页已有 ThingsBuilt。建议改为滚动到 `#built` |
| 旅行照片体积大 | 中 | 3 张旅行照片共约 3.5MB，未压缩。建议压缩到 200-400KB/张 |
| 纹理贴图体积大 | 低 | earth-night.jpg 4.3MB + earth-day.jpg 1.3MB。可考虑 WebP/AVIF 格式 |
| ThingsBuilt 内容 | 低 | 3 个项目均为 Planning/Idea/Coming Soon，无真实可访问作品 |
| AboutCard 头像占位 | 低 | 使用通用 SVG 用户图标，未替换为真实头像 |
| Open Graph 分享图 | 低 | 用户本阶段决定不添加 |
| Hero 箭头点击滚动 | 低 | 用户本阶段决定不添加 |
| 历史时间轴功能 | 待定 | 用户提到过想做，但未进入开发 |

---

## 10. 已知问题和风险点

| 问题/风险 | 严重程度 | 说明 |
|-----------|----------|------|
| Earth3D 不响应 resize | 中 | `getDeviceConfig` 只在挂载时执行一次。手机横竖屏切换后地球尺寸不会更新。 |
| 3D Canvas 全站持续渲染 | 中 | 即使切换到 `/travel` 页面或在后台标签页，Earth3D 仍在消耗 GPU。 |
| 无错误边界 | 低 | 项目没有 React Error Boundary。Earth3D 的 Three.js 报错可能导致整个应用白屏。 |
| 旅行照片未懒加载 | 低 | TravelGallery 和 TravelPage 的图片没有 `loading="lazy"`。 |
| 无代码分割 | 低 | Leaflet 代码在首页也会被加载。未使用 React.lazy 做路由级懒加载。 |
| 分隔线样式不统一 | 低 | TravelGallery/ThingsBuilt 是左到右渐变，Contact 是居中渐变。 |
| Earth3D 初始朝向 | 低 | rotation.y = 2.6，如东亚不在正面需微调。 |

**当前无报错。** `npm run build` 通过，浏览器控制台干净。

---

## 11. 下一步建议

按优先级排序：

1. **修复 EntryCards 入口逻辑** — 「关于我」滚动到 `#about`，「做过的东西」滚动到 `#built`，只保留「个人说明书」弹 Coming Soon
2. **压缩旅行照片** — 用 tinypng.com 或 sips 把 3 张照片压缩到 200-400KB/张
3. **Earth3D 性能优化** — 添加 `document.visibilitychange` 暂停渲染；监听 resize 响应横竖屏切换
4. **代码分割** — 对 TravelPage 和 Earth3D 做 React.lazy 懒加载
5. **添加真实作品到 ThingsBuilt** — 至少保留 1 个有真实链接的项目

---

## 12. 给下一个聊天界面的接手说明

### 接手前必读

1. **不要修改 Earth3D.jsx** 除非明确要调整地球视觉。当前参数经过多轮微调（桌面端/手机端双配置）。
2. **不要修改 Hero.jsx** 除非要调整首屏文案。文字阴影和 z-index 是确保在地球背景上可读的关键。
3. **不要删除 App.jsx 中的全局遮罩层**（z-[1] 的 radial-gradient）。这是全站文字可读性的基础。
4. **不要创建 postcss.config.js** 或混用 PostCSS 方案。Tailwind v4 当前使用 Vite 插件方案。
5. **不要引入重的动画库**（如 Framer Motion / GSAP）。当前用 IntersectionObserver + CSS transition 已实现滚动动画，足够轻量。
6. **TravelGallery.jsx 采用 img 始终渲染 + opacity 淡入方案**。照片显示已验证正常，如需调整图片显示逻辑，请谨慎测试。
7. **项目已使用 react-router-dom**。新增页面路由在 `src/App.jsx` 的 `<Routes>` 中添加，页面组件放 `src/pages/`。

### 如需添加新功能

- **新组件**：放到 `src/components/`
- **新页面**：放到 `src/pages/`，在 `App.jsx` 中添加 Route
- **新 hook**：放到 `src/hooks/`
- **新静态资源**：放到 `public/`
- **颜色/主题调整**：优先改 `tailwind.config.js` 中的 tony-* 颜色变量，不要硬编码颜色

### 如需调试 3D 地球

Earth3D 在控制台会输出贴图加载信息，打开浏览器 DevTools Console 可以看到：
```
[Earth3D] Textures loaded — day: 4096x2048, night: 5120x2560
```

### 快速检查清单

每次开发后检查：
- [ ] `npm run dev` 能正常启动
- [ ] 浏览器控制台无报错
- [ ] 手机端无横向滚动条
- [ ] 地球背景正常显示
- [ ] 各区域滚动动画正常触发
- [ ] Navbar 滚动后出现 + 锚点跳转正常
- [ ] `/travel` 路由可正常访问，地图和卡片联动正常
- [ ] 构建 `npm run build` 通过

---

*本文档由开发代理创建，后续每次开发完成后应更新「最近一次修改记录」和「当前未完成事项」部分。*
