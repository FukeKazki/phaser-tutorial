import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.CI ? '/phaser-tutorial/' : '/',
})