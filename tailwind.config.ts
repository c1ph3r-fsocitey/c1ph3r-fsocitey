import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  '#eefbfc',
          100: '#d4f5f8',
          200: '#aeecf2',
          300: '#76dde8',
          400: '#37c5d7',
          500: '#1aa9bd',   // primary accent
          600: '#1789a0',
          700: '#196e82',
          800: '#1d5a6b',
          900: '#1c4b5b',
          950: '#0d2f3c',
        },
        // Dark theme surfaces
        surface: {
          900: '#050b12',   // page bg
          800: '#0a1520',   // card bg
          700: '#0f1f2e',   // elevated card
          600: '#162636',   // hover state
          500: '#1e3345',   // border-ish
        },
        // Accent colors
        accent: {
          cyan:   '#1aa9bd',
          blue:   '#2563eb',
          purple: '#7c3aed',
          orange: '#ea580c',
          green:  '#16a34a',
          red:    '#dc2626',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-geist-mono)', 'Menlo', 'monospace'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231aa9bd' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'hero-gradient': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(26,169,189,0.15) 0%, transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26,169,189,0.08) 0%, rgba(10,21,32,0) 100%)',
        'glow-border': 'linear-gradient(135deg, rgba(26,169,189,0.5), rgba(26,169,189,0.1))',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-up':      'fadeUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'scan-line':    'scanLine 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(26,169,189,0.15)' },
          '50%':      { boxShadow: '0 0 40px rgba(26,169,189,0.35)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(26,169,189,0.25)',
        'glow-lg': '0 0 40px rgba(26,169,189,0.35)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      borderColor: {
        'brand-subtle': 'rgba(26,169,189,0.2)',
        'brand-medium': 'rgba(26,169,189,0.4)',
      },
    },
  },
  plugins: [],
}

export default config
