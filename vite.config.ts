import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // En Vercel, la app se sirve desde la raíz '/', no desde un subdirectorio.
  base: '/',
})
