import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vaiiopfowevcnebxksyi.supabase.co';
// Tenta buscar de SUPABASE_ANON_KEY ou cai para API_KEY se disponível
const rawKey = process.env.SUPABASE_ANON_KEY || process.env.API_KEY || '';

/**
 * Extrai o JWT puro da chave.
 * Remove prefixos como 'sb_publishable_' e garante que o token seja um JWT válido (3 partes).
 */
const getCleanJwt = (key: string) => {
  if (!key) return '';
  
  let cleanKey = key.trim();

  // Se a chave contiver o prefixo de plataforma (ex: Easypanel/Supabase Local)
  if (cleanKey.includes('sb_publishable_')) {
    const parts = cleanKey.split('.');
    if (parts.length >= 3) {
      // O JWT é composto por Header.Payload.Signature
      // Frequentemente o prefixo está grudado na Signature
      const signaturePart = parts[2].split('sb_publishable_')[0];
      cleanKey = `${parts[0]}.${parts[1]}.${signaturePart}`;
    }
  }

  // Remove qualquer caractere que não pertença a um JWT padrão (Base64 + pontos)
  return cleanKey.replace(/[^a-zA-Z0-9._-]/g, '');
};

const SUPABASE_ANON_KEY = getCleanJwt(rawKey);

if (!SUPABASE_ANON_KEY) {
  console.error('ERRO CRÍTICO: SUPABASE_ANON_KEY não encontrada nas variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY || 'MISSING_KEY', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  }
});