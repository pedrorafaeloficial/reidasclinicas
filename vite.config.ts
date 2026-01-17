
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://vaiiopfowevcnebxksyi.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vx5kEGJnpbueVBvfOA3DQA_7LB2pQl-'),
      'window.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
      'window.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    },
    server: {
      port: 3020,
      strictPort: true,
      host: true,
      allowedHosts: true // Permitir todos os hosts no modo dev/preview para evitar bloqueios de rede local
    },
    preview: {
      port: 3020,
      strictPort: true,
      host: true,
      allowedHosts: true // Garante que em produção o host não seja bloqueado por headers inválidos
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Desabilitar sourcemaps para produção (performance e segurança)
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  };
});
