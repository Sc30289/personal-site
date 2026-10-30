import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#FFFFFF',
          900: '#F6F7F9',
          800: '#FFFFFF',
          700: '#F0F2F5',
          600: '#E4E7EC',
        },
        mist: '#1F2937',
        muted: '#5B6472',
        accent: {
          DEFAULT: '#D97706',
          violet: '#E11D48',
          cyan: '#B45309',
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
        glow: '0 0 60px -18px rgba(217, 119, 6, 0.35)',
        card: '0 24px 60px -30px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(217,119,6,0.07), transparent 55%)',
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
