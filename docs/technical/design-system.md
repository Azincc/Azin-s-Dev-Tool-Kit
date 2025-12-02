# Design System & Tokens

This document outlines the design tokens and system used in Azin's Dev Toolkit. We use CSS variables integrated with Tailwind CSS to manage themes and consistency.

## Tokens Source of Truth

The source of truth for tokens is `src/styles/design-system.ts`. This file exports strongly typed objects representing the design decisions.
However, the implementation is done via CSS variables in `src/index.css` and referenced in `tailwind.config.js`.

## CSS Variables

Variables are defined in `src/index.css` under `:root` for light mode and `.dark` for dark mode.

### Colors

| Token | Variable | Tailwind Utility | Description |
|-------|----------|------------------|-------------|
| **Backgrounds** | | | |
| Page | `--bg-page` | `bg-background-page` | Main app background (Slate 50 / Slate 900) |
| Surface | `--bg-surface` | `bg-background-surface` | Card/Container background (White / Slate 800) |
| Surface Highlight | `--bg-surface-highlight` | `bg-background-highlight` | Subtle highlights (Slate 50 / Slate 800) |
| Input | `--bg-input` | `bg-background-input` | Form inputs background |
| **Text** | | | |
| Primary | `--text-primary` | `text-text-primary` | Main content text |
| Secondary | `--text-secondary` | `text-text-secondary` | Subtitles, labels |
| Muted | `--text-muted` | `text-text-muted` | Hints, placeholders |
| Inverse | `--text-inverse` | `text-text-inverse` | Text on contrasting backgrounds |
| **Border** | | | |
| Default | `--border-default` | `border-border` | Default borders |
| Input | `--border-input` | `border-border-input` | Input borders |
| **Brand** | | | |
| Primary | `--brand-primary` | `text-brand-primary`, `bg-brand-primary` | Primary brand color (Blue 600) |
| Hover | `--brand-hover` | `hover:bg-brand-hover` | Hover state for primary actions |
| **Status** | | | |
| Error Bg | `--status-error-bg` | `bg-status-error-bg` | Background for error messages |
| Error Text | `--status-error-text` | `text-status-error-text` | Text color for errors |

### Spacing

| Token | Variable | Tailwind Utility | Value |
|-------|----------|------------------|-------|
| Layout Page | `--spacing-layout-page` | `p-layout-page` | 2rem (32px) |
| Layout Section | `--spacing-layout-section` | `p-layout-section` | 3rem (48px) |

### Radii

| Token | Variable | Tailwind Utility | Value |
|-------|----------|------------------|-------|
| Small | `--radius-sm` | `rounded-sm` | 0.125rem |
| Medium | `--radius-md` | `rounded-md` | 0.375rem |
| Large | `--radius-lg` | `rounded-lg` | 0.5rem |
| XLarge | `--radius-xl` | `rounded-xl` | 0.75rem |

## Rules for New Tokens

1. **Define in `design-system.ts`**: Add the conceptual token in the TypeScript file first.
2. **Add CSS Variable**: Add the variable to `src/index.css` in both `:root` and `.dark` blocks.
3. **Update Tailwind Config**: Add the reference in `tailwind.config.js`.
4. **Usage**: Use the Tailwind utility class in components. Avoid using raw hex values or arbitrary values (e.g. `bg-[#123456]`).

## Typography

Base typography is set in `src/index.css` on the `body` tag:
- Font: Sans-serif (System UI)
- Color: `text-text-primary`
- Background: `bg-background-page`
