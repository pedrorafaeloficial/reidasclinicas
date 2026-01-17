import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vaiiopfowevcnebxksyi.supabase.co';
const rawKey = process.env.API_KEY || '';

/**
 * Limpa a chave para garantir que apenas o JWT seja utilizado.
 * Remove prefixos como 'sb_publishable_' que invalidam a chamada à API.
 */
const cleanJwt = (key: string) => {
  if (!key) return '';
  const parts = key.split('.');
  if (parts.length >= 3) {
    // Isola a assinatura do JWT e remove sufixos de plataforma
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