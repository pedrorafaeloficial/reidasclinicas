
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' as a fallback for the current directory to avoid 'process.cwd()' type issues in some environments
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
      'window.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
      'window.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    },
    server: {
      port: 3020,
      strictPort: true,
      host: true,
      allowedHosts: [
        'testes-reidasclinicas.vlxcg6.easypanel.host',
        'reidasclinicas.com',
        'www.reidasclinicas.com'
      ]
    },
    preview: {
      port: 3020,
      strictPort: true,
      host: true,
      allowedHosts: [
        'testes-reidasclinicas.vlxcg6.easypanel.host',
        'reidasclinicas.com',
        'www.reidasclinicas.com'
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  };
});
