import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署在 /personal-site/ 子路径下，构建时通过 VITE_BASE 指定。
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
})
