
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3020,
    strictPort: true,
    host: true,
    allowedHosts: [
      'testes-reidasclinicas.vlxcg6.easypanel.host',
      'reidasclinicas.com.br',
      'www.reidasclinicas.com.br'
    ]
  },
  preview: {
    port: 3020,
    strictPort: true,
    host: true,
    allowedHosts: [
      'testes-reidasclinicas.vlxcg6.easypanel.host',
      'reidasclinicas.com.br',
      'www.reidasclinicas.com.br'
    ]
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
