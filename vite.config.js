import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Ensure the necessary files are injected globally
        additionalData: `
          @use "src/styles/colors" as *;
          @use "src/styles/fonts" as *;
          @use "src/styles/media-queries" as *;
          @use "src/styles/typography" as *;
          @use "src/styles/mixins" as *;
        `,
      },
    },
  },
  plugins: [react()],
})
