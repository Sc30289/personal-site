import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A12',
          900: '#0B0F1A',
          800: '#111726',
          700: '#1A2235',
          600: '#243049',
        },
        mist: '#E6EAF2',
        muted: '#9AA7BD',
        accent: {
          DEFAULT: '#38BDF8',
          violet: '#818CF8',
          cyan: '#22D3EE',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
        mono: ['Cascadia Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(56, 189, 248, 0.45)',
        card: '0 24px 60px -30px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.12), transparent 55%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [typography],
}
