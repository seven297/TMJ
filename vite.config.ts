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
  },
  server: {
    port: 3000,
    proxy: {
      // 代理所有以 /tmj 开头的请求
      '/tmj': {
        target: 'http://116.62.56.18/api', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmj/, '') // 可选：重写路径
      }
    }
  }
})
