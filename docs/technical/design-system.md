# 设计系统与令牌 (Design System & Tokens)

本文档概述了 Azin's Dev Toolkit 中使用的设计令牌和系统。我们使用与 Tailwind CSS 集成的 CSS 变量来管理主题和一致性。

## 令牌单一数据源 (Tokens Source of Truth)

令牌的单一数据源是 `src/styles/design-system.ts`。该文件导出了代表设计决策的强类型对象。
然而，实际实现是通过 `src/index.css` 中的 CSS 变量并在 `tailwind.config.js` 中引用来完成的。

## CSS 变量 (CSS Variables)

变量定义在 `src/index.css` 中，亮色模式在 `:root` 下，暗色模式在 `.dark` 下。

### 颜色 (Colors)

| 令牌 (Token) | 变量 (Variable) | Tailwind 工具类 (Utility) | 描述 (Description) |
|-------|----------|------------------|-------------|
| **背景 (Backgrounds)** | | | |
| Page | `--bg-page` | `bg-background-page` | 主应用背景 (Slate 50 / Slate 900) |
| Surface | `--bg-surface` | `bg-background-surface` | 卡片/容器背景 (White / Slate 800) |
| Surface Highlight | `--bg-surface-highlight` | `bg-background-highlight` | 微妙的高亮，带透明度 (Slate 50 / Slate 800) |
| Secondary | `--bg-secondary` | `bg-background-secondary` | 次级背景 (Slate 100 / Slate 700) |
| Input | `--bg-input` | `bg-background-input` | 表单输入框背景 |
| **文本 (Text)** | | | |
| Primary | `--text-primary` | `text-text-primary` | 主要内容文本 |
| Secondary | `--text-secondary` | `text-text-secondary` | 副标题、标签 |
| Muted | `--text-muted` | `text-text-muted` | 提示、占位符 |
| Inverse | `--text-inverse` | `text-text-inverse` | 对比背景上的文本 |
| **边框 (Border)** | | | |
| Default | `--border-default` | `border-border` | 默认边框 |
| Muted | `--border-muted` | `border-border-muted` | 柔和边框，用于深色模式下的卡片等 (Slate 200 / Slate 800) |
| Input | `--border-input` | `border-border-input` | 输入框边框 |
| **品牌 (Brand)** | | | |
| Primary | `--brand-primary` | `text-brand-primary`, `bg-brand-primary` | 主品牌色 (Blue 600) |
| Hover | `--brand-hover` | `hover:bg-brand-hover` | 主要操作的悬停状态 |
| **状态 (Status)** | | | |
| Error Bg | `--status-error-bg` | `bg-status-error-bg` | 错误信息背景 |
| Error Text | `--status-error-text` | `text-status-error-text` | 错误文本颜色 |

### 间距 (Spacing)

| 令牌 (Token) | 变量 (Variable) | Tailwind 工具类 (Utility) | 值 (Value) |
|-------|----------|------------------|-------|
| Layout Page | `--spacing-layout-page` | `p-layout-page` | 2rem (32px) |
| Layout Section | `--spacing-layout-section` | `p-layout-section` | 3rem (48px) |

### 圆角 (Radii)

| 令牌 (Token) | 变量 (Variable) | Tailwind 工具类 (Utility) | 值 (Value) |
|-------|----------|------------------|-------|
| Small | `--radius-sm` | `rounded-sm` | 0.125rem |
| Medium | `--radius-md` | `rounded-md` | 0.375rem |
| Large | `--radius-lg` | `rounded-lg` | 0.5rem |
| XLarge | `--radius-xl` | `rounded-xl` | 0.75rem |

## 新令牌规则 (Rules for New Tokens)

1. **在 `design-system.ts` 中定义**: 首先在 TypeScript 文件中添加概念上的令牌。
2. **添加 CSS 变量**: 在 `src/index.css` 的 `:root` 和 `.dark` 块中添加变量。
3. **更新 Tailwind 配置**: 在 `tailwind.config.js` 中添加引用。
4. **使用**: 在组件中使用 Tailwind 工具类。避免使用原始十六进制值或任意值（例如 `bg-[#123456]`）。

## 排版 (Typography)

基础排版在 `src/index.css` 的 `body` 标签上设置：
- 字体: Sans-serif (系统 UI)
- 颜色: `text-text-primary`
- 背景: `bg-background-page`
