import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // 关键：相对路径配置
  resolve: {
    alias: {
      '@': path.join(process.cwd(), './src'),
    }
  }
})
