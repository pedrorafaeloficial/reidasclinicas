import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vaiiopfowevcnebxksyi.supabase.co';
// Prioridade para SUPABASE_ANON_KEY conforme solicitado
const rawKey = process.env.SUPABASE_ANON_KEY || process.env.API_KEY || '';

/**
 * Limpa a chave de espaços em branco ou aspas acidentais.
 */
const getCleanKey = (key: string) => {
  if (!key) return '';
  let clean = key.trim().replace(/^["']|["']$/g, '');
  
  // Tratamento para chaves que podem vir com prefixo de plataforma (comum em certos ambientes de deploy)
  if (clean.includes('sb_publishable_')) {
    const parts = clean.split('.');
    if (parts.length >= 3) {
      const signaturePart = parts[2].split('sb_publishable_')[0];
      clean = `${parts[0]}.${parts[1]}.${signaturePart}`;
    }
  }
  return clean;
};

const finalKey = getCleanKey(rawKey);

if (!finalKey) {
  console.error('ERRO: SUPABASE_ANON_KEY não foi encontrada. Verifique as configurações de ambiente.');
}

export const supabase = createClient(supabaseUrl, finalKey || 'KEY_MISSING', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});