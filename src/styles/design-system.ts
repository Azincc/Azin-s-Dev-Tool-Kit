export const palette = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  red: {
    100: '#fee2e2',
    200: '#fecaca',
    700: '#b91c1c',
    900: '#7f1d1d',
  },
  white: '#ffffff',
  black: '#000000',
} as const;

export const tokens = {
  colors: {
    background: {
      page: {
        light: palette.slate[50],
        dark: palette.slate[900],
      },
      surface: {
        light: palette.white,
        dark: palette.slate[800],
      },
      sidebar: {
        light: palette.white,
        dark: '#020617', // slate-950
      },
      surfaceHighlight: {
        light: 'rgb(248 250 252 / 0.5)', // slate-50/50
        dark: 'rgb(30 41 59 / 0.5)', // slate-800/50
      },
      input: {
        light: palette.slate[50],
        dark: palette.slate[900],
      },
      secondary: {
        light: palette.slate[100],
        dark: palette.slate[700],
      },
      muted: {
        light: palette.slate[100], // matches bg-secondary light
        dark: palette.slate[800], // matches bg-surface dark, darker than secondary
      }
    },
    text: {
      primary: {
        light: palette.slate[900],
        dark: palette.slate[100],
      },
      secondary: {
        light: palette.slate[500],
        dark: palette.slate[400],
      },
      muted: {
        light: palette.slate[400],
        dark: palette.slate[500],
      },
      inverse: {
        light: palette.white,
        dark: palette.white, // inverse on brand color should be white in dark mode too
      },
    },
    border: {
      default: {
        light: palette.slate[200],
        dark: palette.slate[700],
      },
      muted: {
        light: palette.slate[200],
        dark: palette.slate[800],
      },
      input: {
        light: palette.slate[300],
        dark: palette.slate[700],
      },
    },
    brand: {
      primary: palette.blue[600],
      hover: palette.blue[700],
    },
    status: {
      error: {
        bg: { light: palette.red[100], dark: 'rgba(127, 29, 29, 0.5)' }, // dark:bg-red-900/50
        text: { light: palette.red[700], dark: palette.red[200] },
        border: { light: palette.red[200], dark: palette.red[900] },
      }
    }
  },
  spacing: {
    layout: {
      page: '2rem', // p-8
      section: '3rem', // p-12
    },
    component: {
      xxs: '0.125rem', // 2px
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    }
  },
  radii: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }
  }
} as const;
