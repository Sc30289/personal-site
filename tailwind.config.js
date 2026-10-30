import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06100B',
          900: '#0A1610',
          800: '#102019',
          700: '#172C22',
          600: '#21402F',
        },
        mist: '#E8F1E9',
        muted: '#96A99B',
        accent: {
          DEFAULT: '#F59E0B',
          violet: '#FB7185',
          cyan: '#FBBF24',
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
        glow: '0 0 60px -12px rgba(245, 158, 11, 0.45)',
        card: '0 24px 60px -30px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.14), transparent 55%)',
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
