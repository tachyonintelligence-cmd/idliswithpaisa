import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the build works on a custom domain or a sub-path (GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss()],
})
