import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/App.scss" as *;`,
      },
    },
  },
  plugins: [react()],
})