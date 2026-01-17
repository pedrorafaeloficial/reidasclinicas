import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANTE: Para configurar no ambiente:
 * 1. A chave (sb_publishable_...) deve estar na variável: process.env.API_KEY
 * 2. A URL deve estar na variável: process.env.SUPABASE_URL (opcional, fallback incluído)
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://vaiiopfowevcnebxksyi.supabase.co';
const rawKey = process.env.API_KEY || '';

/**
 * O erro 'Invalid API key' ocorre quando o sufixo 'sb_publishable' é enviado à API REST.
 * Esta função isola apenas o JWT (as 3 primeiras partes separadas por ponto).
 */
const cleanJwt = (key: string) => {
  if (!key) return '';
  const parts = key.split('.');
  if (parts.length >= 3) {
    // Pega a assinatura e remove qualquer texto após o padrão do token
    const signature = parts[2].split('sb_publishable_')[0].replace(/[^a-zA-Z0-9_-]/g, '');
    return `${parts[0]}.${parts[1]}.${signature}`;
  }
  return key;
};

const apiKey = cleanJwt(rawKey);

export const supabase = createClient(supabaseUrl, apiKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`
    }
  }
});