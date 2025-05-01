import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      '@react-oauth/google',
      'jwt-decode',
      'react-bootstrap'
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/financeapp/Myfinanceapp/Backend-finance',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});