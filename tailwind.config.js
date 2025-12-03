/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        background: {
          page: 'var(--bg-page)',
          surface: 'var(--bg-surface)',
          highlight: 'var(--bg-surface-highlight)',
          input: 'var(--bg-input)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          muted: 'var(--border-muted)',
          input: 'var(--border-input)',
        },
        brand: {
          primary: 'var(--brand-primary)',
          hover: 'var(--brand-hover)',
        },
        status: {
          error: {
            bg: 'var(--status-error-bg)',
            text: 'var(--status-error-text)',
            border: 'var(--status-error-border)',
          }
        },
        slate: {
          850: '#151e2e',
          950: '#020617',
        }
      },
      spacing: {
        'layout-page': 'var(--spacing-layout-page)',
        'layout-section': 'var(--spacing-layout-section)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    }
  },
  plugins: [],
}
