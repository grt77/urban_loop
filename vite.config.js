import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/urban_loop/',
  publicPath: process.env.NODE_ENV === 'production' ? '/urban_loop/' : '/',
})
