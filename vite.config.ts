
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Remove base para Vercel (serve desde a raiz)
  base: '/',
  build: {
    outDir: 'dist',
  },
});
