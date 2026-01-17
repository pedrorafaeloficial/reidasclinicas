
import { createClient } from '@supabase/supabase-js';

// Função para limpar strings de ambiente que podem vir com aspas ou espaços
const cleanEnvVar = (val: any): string => {
  if (typeof val !== 'string') return '';
  return val.replace(/^["'](.+)["']$/, '$1').trim();
};

// URL e Key Hardcoded como fallback final caso o ambiente falhe
const FALLBACK_URL = 'https://vaiiopfowevcnebxksyi.supabase.co';
const FALLBACK_KEY = 'sb_publishable_vx5kEGJnpbueVBvfOA3DQA_7LB2pQl-';

// @ts-ignore
const env = (import.meta as any).env || {};

const supabaseUrl = cleanEnvVar(
  env.VITE_SUPABASE_URL || 
  (window as any).VITE_SUPABASE_URL || 
  FALLBACK_URL
);

const supabaseKey = cleanEnvVar(
  env.VITE_SUPABASE_ANON_KEY || 
  (window as any).VITE_SUPABASE_ANON_KEY || 
  FALLBACK_KEY
);

if (!supabaseKey || supabaseKey === 'undefined' || supabaseKey.length < 10) {
  console.warn("Supabase Key inválida detectada, usando fallback.");
}

// Configuração extra para garantir compatibilidade com redes instáveis
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { 'x-application-name': 'rei-das-clinicas' },
  },
});
