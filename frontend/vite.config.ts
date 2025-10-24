import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  // ✅ Necesario para rutas correctas en producción
  base: "",
  build: {
    outDir: './../backend/app/static',
    emptyOutDir: true,
  },
})
