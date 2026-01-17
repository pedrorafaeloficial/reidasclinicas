import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  // Cast process to any to fix: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso substitui "process.env.API_KEY" pelo valor real da chave durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
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
  };
});