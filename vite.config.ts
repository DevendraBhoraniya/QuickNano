import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        content: "/src/content/contentScript.ts",
        background: "/src/background/background.ts"
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  }
})
