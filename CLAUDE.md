# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3000)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Architecture Overview

This is a React-based developer toolkit with multiple utility tools. The application uses:

- **React 19** with TypeScript
- **Vite** as the build tool
- **React Router** with HashRouter for client-side routing
- **Tailwind CSS** for styling
- **pnpm** as the package manager

### Key Architectural Patterns

**Context-Based State Management**: The app uses React Context (`AppContext`) for global state:
- Theme management (dark/light mode) - persisted to localStorage
- Language switching (English/Chinese) - defaults to Chinese
- Translation function `t()` for i18n

**Lazy Loading**: All tool components are lazy-loaded via `React.lazy()` to optimize bundle size. The build configuration splits chunks for react-vendor, router, and monaco editor.

**Routing Structure**: Navigation is defined in `App.tsx` via the `navGroups` array, which maps tool IDs to paths and components. Tools are organized into categories: Formatters, Security, Frontend, Network, Text, and Time.

**Component Organization**:
- `src/components/tools/` - Individual tool implementations (JsonTools, HashTools, etc.)
- `src/components/ui/` - Shared UI components (Icons, Toast, Shared)
- `src/contexts/` - React Context providers
- `src/locales/` - i18n translation files (en.json, zh.json)
- `src/pages/` - Page components (Home)

**Internationalization**: Translations are stored in JSON files (`src/locales/en.json` and `zh.json`). Access translations via the `t()` function from `useAppContext()`. Translation keys follow dot notation (e.g., `nav.home`, `nav.formatters`).

**Path Alias**: The `@/` alias maps to `./src/` (configured in both tsconfig.json and vite.config.ts).

## Adding New Tools

To add a new tool:

1. Create the tool component in `src/components/tools/YourTool.tsx`
2. Add lazy import in `App.tsx`
3. Add route in the `<Routes>` section
4. Add navigation item to appropriate `navGroups` category with icon, label (translation key), and path
5. Add translation keys to both `src/locales/en.json` and `src/locales/zh.json`
6. Add tool card to Home.tsx

## Docker Deployment

The app uses a multi-stage Docker build:
- Stage 1: Node 20 Alpine builds the app with pnpm
- Stage 2: Nginx 1.25 Alpine serves the static files

```bash
docker build -t azin-dev-toolkit .
docker run -p 9080:80 azin-dev-toolkit
```

## Build Configuration

The Vite build is optimized with:
- Manual chunk splitting for react-vendor, router, and monaco
- Terser minification with console/debugger removal in production
- Base path set to `./` for flexible deployment
