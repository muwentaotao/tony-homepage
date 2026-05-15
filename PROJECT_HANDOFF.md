# PROJECT_HANDOFF.md — Tony 个人主页

> 本文档是项目状态记录，每次开发完成后应更新。  
> 最后更新：2026-05-15

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

---

## 4. 当前页面结构

单页应用（SPA），所有内容在一个页面上垂直排列：

```
[固定层] Earth3D — 3D夜景地球背景（全站fixed）
[固定层] 全局暗色径向渐变遮罩（z-[1]）
[固定层] Navbar — 顶部导航栏（滚动后出现，z-40）

[滚动内容层] Hero — Tony名字 + 主文案 + 身份标签 + 向下滚动提示
[滚动内容层] AboutCard — 关于我横向卡片（id="about"）
[滚动内容层] EntryCards — 4张入口卡片 + Coming Soon弹窗
[滚动内容层] TravelGallery — 旅行照片墙（id="travel"）
[滚动内容层] ThingsBuilt — 项目展示（id="built"）
[滚动内容层] Contact — 联系区（id="contact"）
[滚动内容层] Footer — 页脚
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
- [x] 双贴图模式支持（白天地形 + 夜景灯光叠加）
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
- [x] Contact 联系区

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
- [x] 桌面端贴图升级到 5120×2560（4.3 MB，sips best 质量）
- [x] 手机端贴图 2048×1024
- [x] 原图备份（earth-night-original.jpg, 13500×6750）
- [x] Earth3D 按设备加载不同贴图
- [x] 手机端地球缩小（scale 1.0, cameraZ 4.8）
- [x] dpr / 星星数量按设备调整
- [x] 贴图加载前显示占位地球，加载后淡入

---

## 6. 重要文件说明

### 配置文件
| 文件 | 说明 |
|------|------|
| `vite.config.js` | Vite 配置，plugins: [react(), tailwindcss()] |
| `tailwind.config.js` | Tailwind v4 主题配置，定义了 tony-* 颜色体系和动画 |
| `index.html` | 页面入口，lang="zh-CN"，标题 "Tony · History Teacher & Digital Space" |

### 源码文件
| 文件 | 职责 | 状态 |
|------|------|------|
| `src/main.jsx` | React 应用挂载入口，StrictMode | 稳定 |
| `src/App.jsx` | 根组件，组装所有层级（背景→遮罩→导航→内容） | 稳定 |
| `src/index.css` | 全局样式 + `@import "tailwindcss"` + glass-card / text-gradient 工具类 | 稳定 |
| `src/components/Earth3D.jsx` | **3D 地球核心**。按设备加载贴图、渲染球体+大气层+星空、自动旋转、淡入效果。 | **稳定，勿轻易修改** |
| `src/components/Hero.jsx` | 首屏。Tony 名字 + 主文案 + 身份标签 + 向下箭头。 | 稳定 |
| `src/components/Navbar.jsx` | 顶部导航栏。滚动后出现，Tony logo + 4 个锚点。 | 稳定 |
| `src/components/Modal.jsx` | Coming Soon 弹窗。深色弹窗 + 淡入淡出 + 点击/ESC/遮罩关闭。 | 稳定 |
| `src/hooks/useScrollReveal.js` | IntersectionObserver hook。提供 ref + isVisible 用于滚动动画。 | 稳定 |
| `src/components/AboutCard.jsx` | 关于我卡片。id="about"。头像占位 + 文案 + 标签。 | 稳定 |
| `src/components/EntryCards.jsx` | 4 张入口卡片。点击弹出 Coming Soon。 | 稳定 |
| `src/components/TravelGallery.jsx` | 旅行照片墙。id="travel"。3 张卡片，img 始终渲染 + opacity 淡入。 | 近期修改 |
| `src/components/ThingsBuilt.jsx` | 项目展示。id="built"。3 张项目卡片。 | 稳定 |
| `src/components/Contact.jsx` | 联系区。id="contact"。Email + GitHub 占位。 | 稳定 |
| `src/components/Footer.jsx` | 页脚版权信息。 | 稳定 |

### 静态资源
| 路径 | 说明 |
|------|------|
| `public/textures/earth-night.jpg` | 夜景地球贴图。桌面端高清版（5120×2560, 4.3 MB） |
| `public/textures/earth-night-mobile.jpg` | 手机端夜景贴图（2048×1024, 186 KB） |
| `public/textures/earth-night-original.jpg` | 原图备份（13500×6750, 7.7 MB） |
| `public/textures/earth-day.jpg` | 白天地形贴图。**不存在**。Earth3D 会尝试加载，失败则降级到单贴图模式 |
| `public/travel/travel-1.jpg` | 旅行照片 1（1200×900, ~1.2 MB） |
| `public/travel/travel-2.jpg` | 旅行照片 2（1200×900, ~1.2 MB） |
| `public/travel/travel-3.jpg` | 旅行照片 3（1200×900, ~910 KB） |

---

## 7. 当前正在开发的阶段

**当前阶段：第九阶段（3D 地球性能与手机端适配）已完成。**

TravelGallery 照片显示问题经过多次修复，采用了 img 始终渲染 + opacity 淡入的方案。最终线上显示状态待验证。

---

## 8. 最近一次修改记录

**日期：** 2026-05-15

**修改内容（第九阶段 + TravelGallery 修复）：**
- 新增 `public/textures/earth-night-original.jpg` — 13500×6750 原图备份
- 新增 `public/textures/earth-night-mobile.jpg` — 2048×1024 手机端贴图
- 修改 `public/textures/earth-night.jpg` — 从 13500×6750 缩放到 5120×2560（4.3 MB）
- 重写 `src/components/Earth3D.jsx` — 按设备加载不同贴图、手机端参数调整、淡入加载体验
- 新增 `public/travel/travel-{1,2,3}.jpg` — 3 张旅行照片
- 多次修改 `src/components/TravelGallery.jsx` — 最终采用 img 始终渲染 + opacity 淡入 + onLoad 控制方案

---

## 9. 当前未完成事项

| 事项 | 优先级 | 说明 |
|------|--------|------|
| 旅行照片线上显示验证 | 高 | TravelGallery 经过多次逻辑修复，最终线上显示状态不确定，需用户验证 |
| 白天地形贴图 | 中 | `public/textures/earth-day.jpg` 不存在。放入后 Earth3D 自动切换双贴图叠加模式，大陆轮廓更清晰 |
| Contact 真实信息 | 低 | Email 和 GitHub 当前都是 `#` 占位链接，需替换为真实信息 |
| 正式子页面 | 待定 | About / Travel / Things Built / Manual 尚无独立页面，点击 EntryCards 只弹 Coming Soon |
| 历史时间轴功能 | 待定 | 用户提到过想做，但未进入开发 |

---

## 10. 已知问题和风险点

| 问题/风险 | 严重程度 | 说明 |
|-----------|----------|------|
| 地球初始朝向 | 低 | rotation.y = 2.6，用户要求东亚在正面。如实际显示不准，需微调此值。 |
| 地球贴图分辨率 | 低 | 当前 earth-night.jpg 5120×2560（4.3 MB），桌面端清晰。但首次加载可能略慢。 |
| 3D Canvas 性能 | 低 | Earth3D 持续 requestAnimationFrame 渲染。低端设备可能出现卡顿。 |
| 无错误边界 | 低 | 项目没有 React Error Boundary。如果 Earth3D 的 Three.js 报错，可能导致整个应用白屏。 |
| 无路由 | 低 | 当前是纯单页，无 React Router。后续如添加子页面需要引入路由库。 |
| TravelGallery 照片显示 | 中 | 经过多次代码修复，采用 opacity 淡入方案。最终线上显示效果待验证。 |

**当前无报错。** 浏览器控制台干净，无 React / Three.js 报错。

---

## 11. 下一步建议

按优先级排序：

1. **验证旅行照片显示** — 强制刷新首页，确认 Some Places I've Been 区域是否正常显示 3 张真实照片
2. **放白天地形贴图（可选但推荐）** — 下载 NASA Blue Marble 到 `public/textures/earth-day.jpg`，Earth3D 自动切换双贴图模式
3. **替换 Contact 占位信息** — 修改 `src/components/Contact.jsx` 中的 Email/GitHub 为真实值
4. **开发正式子页面** — 引入 React Router，为 About / Travel / Things Built / Manual 创建独立路由页面
5. **部署上线** — 已完成 Vercel 部署和自定义域名绑定

---

## 12. 给下一个聊天界面的接手说明

### 接手前必读

1. **不要修改 Earth3D.jsx** 除非明确要调整地球视觉。当前参数经过多轮微调（桌面端/手机端双配置）。
2. **不要修改 Hero.jsx** 除非要调整首屏文案。文字阴影和 z-index 是确保在地球背景上可读的关键。
3. **不要删除 App.jsx 中的全局遮罩层**（z-[1] 的 radial-gradient）。这是全站文字可读性的基础。
4. **不要创建 postcss.config.js** 或混用 PostCSS 方案。Tailwind v4 当前使用 Vite 插件方案。
5. **不要引入重的动画库**（如 Framer Motion / GSAP）。当前用 IntersectionObserver + CSS transition 已实现滚动动画，足够轻量。
6. **TravelGallery.jsx 是近期频繁修改的文件**。当前采用 img 始终渲染 + opacity 淡入方案。如需调整图片显示逻辑，请谨慎测试。

### 如需添加新功能

- **新组件**：放到 `src/components/`
- **新 hook**：放到 `src/hooks/`
- **新页面路由**：当前无路由，如需添加，建议引入 `react-router-dom`
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
- [ ] TravelGallery 图片显示正常（如已放照片）

---

*本文档由开发代理创建，后续每次开发完成后应更新「最近一次修改记录」和「当前未完成事项」部分。*
