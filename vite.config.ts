import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // 部署在 https://bufanjun.com/tools/ 子路径下，所有静态资源与
  // public/ 资源都以此为前缀；hash 路由天然兼容，无需额外处理。
  base: '/tools/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
