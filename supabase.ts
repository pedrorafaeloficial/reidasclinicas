
import { createClient } from '@supabase/supabase-js';

// Função para limpar strings de ambiente que podem vir com aspas ou espaços
const cleanEnvVar = (val: any): string => {
  if (typeof val !== 'string') return '';
  return val.replace(/^["'](.+)["']$/, '$1').trim();
};

// @ts-ignore - fix for Property 'env' does not exist on type 'ImportMeta'
const env = (import.meta as any).env || {};

const supabaseUrl = cleanEnvVar(
  env.VITE_SUPABASE_URL || 
  (window as any).VITE_SUPABASE_URL || 
  'https://vaiiopfowevcnebxksyi.supabase.co'
);

const supabaseKey = cleanEnvVar(
  env.VITE_SUPABASE_ANON_KEY || 
  (window as any).VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_vx5kEGJnpbueVBvfOA3DQA_7LB2pQl-'
);

if (!supabaseKey || supabaseKey === 'undefined') {
  console.error("ERRO: Chave do Supabase não encontrada.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
