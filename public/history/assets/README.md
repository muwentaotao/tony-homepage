# assets 目录

## 背景图

V3 水墨山水背景系统使用以下命名规范：

| 文件名 | 用途 | 当前状态 |
|--------|------|----------|
| `ink-bg-home.webp` | 首页背景 | 待替换（当前使用 CSS 模拟） |
| `ink-bg-china.webp` | 中国历史二级页面背景 | 待替换（当前使用 CSS 模拟） |

## 图片要求

- 格式：webp（优先）或 avif
- 风格：淡白、黑灰、水墨山水、雾气、江水、远处房屋
- 不要：米黄色、红色、金色、青绿色、印章、金线
- 尺寸：建议 1920×1080 或更高，适配桌面端和移动端
- 压缩：确保文件大小不超过 300KB

## 替换步骤

1. 将制作好的背景图放入本目录
2. 在 `style.css` 中取消注释以下代码：
   ```css
   .ink-bg.home .ink-bg-image {
     background-image: url('assets/ink-bg-home.webp');
   }
   .ink-bg.china .ink-bg-image {
     background-image: url('assets/ink-bg-china.webp');
   }
   ```
3. 同时注释掉 `.ink-bg.home .ink-bg-image` 和 `.ink-bg.china .ink-bg-image` 中的 CSS 渐变代码
