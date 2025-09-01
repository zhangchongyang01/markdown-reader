import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  // 设置基础路径，用于GitHub Pages部署
  base: process.env.NODE_ENV === 'production' ? '/markdown-reader/' : '/',
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    // 禁用historyApiFallback，让404页面正常工作
    historyApiFallback: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
